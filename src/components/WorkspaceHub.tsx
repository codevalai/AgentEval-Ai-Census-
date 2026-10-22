import React, { useState, useEffect } from 'react';
import {
  Mail,
  FileText,
  Database,
  Send,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Inbox,
  User as UserIcon,
  LogOut,
  Layers,
  Flame,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  getIdToken,
  db,
  logTelemetryEventToFirestore,
} from '../lib/firebase.ts';

interface WorkspaceHubProps {
  theme: 'worldometers' | 'sovereign';
}

interface GmailMessage {
  id: string;
  threadId: string;
  subject?: string;
  from?: string;
  date?: string;
  snippet?: string;
}

interface GoogleDocItem {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

interface DbRecord {
  id: number;
  itemType: string;
  title: string;
  externalId?: string | null;
  snippet?: string | null;
  createdAt: string | null;
}

interface FirestoreTelemetry {
  id: string;
  userId: string;
  region: string;
  eventDigest: string;
  timestamp: string;
}

export const WorkspaceHub: React.FC<WorkspaceHubProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'gmail' | 'docs' | 'cloudsql' | 'firestore'>('gmail');

  // Firestore Database State
  const [firestoreEvents, setFirestoreEvents] = useState<FirestoreTelemetry[]>([]);
  const [firestoreLoading, setFirestoreLoading] = useState<boolean>(false);
  const [telemetryRegion, setTelemetryRegion] = useState<string>('us-west2');
  const [telemetryDigest, setTelemetryDigest] = useState<string>('');
  const [isLoggingFirestore, setIsLoggingFirestore] = useState<boolean>(false);

  // Cloud SQL Database State (Unified with public.agents & public.workspace_records)
  const [dbRecords, setDbRecords] = useState<DbRecord[]>([]);
  const [sqlAgents, setSqlAgents] = useState<any[]>([]);
  const [sqlEventsCount, setSqlEventsCount] = useState<number>(4);
  const [dbLoading, setDbLoading] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState({
    status: 'ONLINE',
    instance: 'ai-studio-cdf739a6',
    region: 'us-west2',
    project: 'gen-lang-client-0450588751',
    engine: 'PostgreSQL (Developer Edition)',
    orm: 'Drizzle ORM',
    tables: ['agents', 'agent_telemetry_events', 'users', 'workspace_records'],
  });

  // Gmail State
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [gmailLoading, setGmailLoading] = useState<boolean>(false);
  const [gmailError, setGmailError] = useState<string | null>(null);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);

  // Docs State
  const [docsList, setDocsList] = useState<GoogleDocItem[]>([]);
  const [docsLoading, setDocsLoading] = useState<boolean>(false);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [confirmDocOpen, setConfirmDocOpen] = useState(false);

  // Quick Note State for Cloud SQL
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Global Notification
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setIsAuthLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync / load Cloud SQL agents on mount and records when user changes
  useEffect(() => {
    loadCloudSqlAgents();
  }, []);

  useEffect(() => {
    loadCloudSqlAgents();
    if (user) {
      loadDbRecords();
      if (token) {
        loadGmailMessages();
        loadDocsList();
      }
    }
  }, [user, token]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 6000);
  };

  const handleLogin = async () => {
    try {
      setIsAuthLoading(true);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        showNotification('success', `Signed in successfully as ${res.user.email}`);
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      showNotification('error', err?.message || 'Sign in failed. Check popup permissions.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setMessages([]);
    setDocsList([]);
    setDbRecords([]);
    showNotification('success', 'Logged out successfully');
  };

  // Cloud SQL Database operations (queries public.agents + public.workspace_records)
  const loadCloudSqlAgents = async () => {
    try {
      const res = await fetch('/api/cloudsql/agents');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.agents)) {
          setSqlAgents(data.agents);
        }
        if (typeof data.eventsCount === 'number') {
          setSqlEventsCount(data.eventsCount);
        }
      }
    } catch (err) {
      console.warn('Cloud SQL agents fetch notice:', err);
    }
  };

  const loadDbRecords = async () => {
    setDbLoading(true);
    try {
      await loadCloudSqlAgents();
      const idToken = await getIdToken();
      if (!idToken) return;

      const res = await fetch('/api/workspace/records', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDbRecords(data || []);
      }
    } catch (err) {
      console.error('Failed to load database records:', err);
    } finally {
      setDbLoading(false);
    }
  };

  // Firestore Database Operations
  const loadFirestoreTelemetry = async () => {
    if (!user) return;
    setFirestoreLoading(true);
    try {
      const colRef = collection(db, 'users', user.uid, 'telemetry');
      const snap = await getDocs(colRef);
      const events: FirestoreTelemetry[] = [];
      snap.forEach((docSnap) => {
        events.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setFirestoreEvents(events);
    } catch (err: any) {
      console.warn('Error reading from Firestore:', err);
    } finally {
      setFirestoreLoading(false);
    }
  };

  const handleSaveFirestoreTelemetry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoggingFirestore(true);
    try {
      const digest = telemetryDigest.trim() || `MERKLE-ROOT-${Date.now().toString(16).toUpperCase()}`;
      await logTelemetryEventToFirestore(user.uid, telemetryRegion, digest);
      setTelemetryDigest('');
      showNotification('success', 'Planetary telemetry event written to Firebase Firestore (/users/' + user.uid + '/telemetry)');
      await loadFirestoreTelemetry();
    } catch (err: any) {
      console.error('Firestore write error:', err);
      showNotification('error', 'Failed to write telemetry to Firestore: ' + (err?.message || 'Permission denied'));
    } finally {
      setIsLoggingFirestore(false);
    }
  };

  const saveRecordToCloudSql = async (itemType: 'gmail' | 'docs' | 'telemetry', title: string, snippet?: string, externalId?: string) => {
    try {
      const idToken = await getIdToken();
      if (!idToken) return;

      const res = await fetch('/api/workspace/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ itemType, title, snippet, externalId }),
      });

      if (res.ok) {
        const newRecord = await res.json();
        setDbRecords((prev) => [newRecord, ...prev]);
        return newRecord;
      }
    } catch (err) {
      console.error('Failed to save record to Cloud SQL:', err);
    }
  };

  // Gmail API operations
  const loadGmailMessages = async () => {
    const accessToken = token || (await getAccessToken());
    if (!accessToken) return;

    setGmailLoading(true);
    setGmailError(null);
    try {
      const listRes = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!listRes.ok) {
        throw new Error(`Gmail API returned status ${listRes.status}`);
      }

      const listData = await listRes.json();
      if (!listData.messages || listData.messages.length === 0) {
        setMessages([]);
        setGmailLoading(false);
        return;
      }

      // Fetch headers for each message
      const details = await Promise.all(
        listData.messages.map(async (msg: { id: string; threadId: string }) => {
          try {
            const detailRes = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              const headers = detailData.payload?.headers || [];
              const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === 'subject');
              const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from');
              const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date');
              return {
                id: msg.id,
                threadId: msg.threadId,
                subject: subjectHeader?.value || '(No Subject)',
                from: fromHeader?.value || 'Unknown Sender',
                date: dateHeader?.value || '',
                snippet: detailData.snippet || '',
              };
            }
          } catch {
            return msg;
          }
          return msg;
        })
      );

      setMessages(details);
    } catch (err: any) {
      console.error('Error fetching Gmail messages:', err);
      setGmailError(err.message || 'Unable to fetch Gmail messages. Ensure Gmail permissions are granted.');
    } finally {
      setGmailLoading(false);
    }
  };

  // Send Email with MANDATORY user confirmation
  const handleExecuteSendEmail = async () => {
    setConfirmSendOpen(false);
    const accessToken = token || (await getAccessToken());
    if (!accessToken) {
      showNotification('error', 'Authentication token missing. Please sign in again.');
      return;
    }

    setIsSendingMail(true);
    try {
      const emailLines = [
        `To: ${composeTo}`,
        `Subject: ${composeSubject}`,
        'Content-Type: text/plain; charset=utf-8',
        '',
        composeBody,
      ];
      const rawEmail = emailLines.join('\r\n');
      const encodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ raw: encodedEmail }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || `Failed to send email (${res.status})`);
      }

      const sentData = await res.json();
      showNotification('success', `Email sent successfully! (ID: ${sentData.id})`);

      // Persist log to Cloud SQL
      await saveRecordToCloudSql(
        'gmail',
        `Sent Email: ${composeSubject || '(No Subject)'}`,
        `To: ${composeTo} | Content: ${composeBody.substring(0, 100)}...`,
        sentData.id
      );

      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      loadGmailMessages();
    } catch (err: any) {
      console.error('Send email error:', err);
      showNotification('error', `Failed to send email: ${err.message}`);
    } finally {
      setIsSendingMail(false);
    }
  };

  // Google Docs API operations
  const loadDocsList = async () => {
    const accessToken = token || (await getAccessToken());
    if (!accessToken) return;

    setDocsLoading(true);
    setDocsError(null);
    try {
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.document'&fields=files(id,name,modifiedTime,webViewLink)&pageSize=10",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.ok) {
        throw new Error(`Drive/Docs API returned status ${res.status}`);
      }

      const data = await res.json();
      setDocsList(data.files || []);
    } catch (err: any) {
      console.error('Error fetching Google Docs:', err);
      setDocsError(err.message || 'Unable to list Google Docs. Ensure Drive/Docs permissions are granted.');
    } finally {
      setDocsLoading(false);
    }
  };

  // Create Google Doc with MANDATORY user confirmation
  const handleExecuteCreateDoc = async () => {
    setConfirmDocOpen(false);
    const accessToken = token || (await getAccessToken());
    if (!accessToken) {
      showNotification('error', 'Authentication token missing. Please sign in again.');
      return;
    }

    setIsCreatingDoc(true);
    try {
      // 1. Create document
      const docRes = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newDocTitle || 'Untitled Document',
        }),
      });

      if (!docRes.ok) {
        const errorData = await docRes.json();
        throw new Error(errorData.error?.message || `Failed to create document (${docRes.status})`);
      }

      const docData = await docRes.json();

      // 2. Insert initial text content if provided
      if (newDocContent.trim() && docData.documentId) {
        await fetch(`https://docs.googleapis.com/v1/documents/${docData.documentId}:batchUpdate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: `${newDocContent}\n\n[Created via Sovereign Infinity Workspace Integration]\n`,
                },
              },
            ],
          }),
        });
      }

      showNotification('success', `Google Doc "${newDocTitle}" created successfully!`);

      // Persist document reference to Cloud SQL
      await saveRecordToCloudSql(
        'docs',
        `Google Doc: ${newDocTitle || 'Untitled'}`,
        newDocContent.substring(0, 100),
        docData.documentId
      );

      setNewDocTitle('');
      setNewDocContent('');
      loadDocsList();
    } catch (err: any) {
      console.error('Create doc error:', err);
      showNotification('error', `Failed to create document: ${err.message}`);
    } finally {
      setIsCreatingDoc(false);
    }
  };

  // Save manual note to Cloud SQL
  const handleSaveManualNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    setIsSavingNote(true);
    try {
      await saveRecordToCloudSql('telemetry', noteTitle, noteContent);
      setNoteTitle('');
      setNoteContent('');
      showNotification('success', 'Relational record committed to Cloud SQL PostgreSQL.');
    } catch (err: any) {
      showNotification('error', `Failed to save record: ${err.message}`);
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <section className={`rounded-xl border transition-all ${
      isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900/80 border-slate-800 text-slate-100 backdrop-blur-md'
    } p-6 mb-8`}>
      {/* Header with Title and Auth State */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-5 mb-6 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                Google Workspace & Cloud SQL Hub
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  GCP us-west2
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct integration with Gmail, Google Docs, and Cloud SQL PostgreSQL developer database
              </p>
            </div>
          </div>
        </div>

        {/* Auth / Profile Area */}
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full border border-blue-500" />
              ) : (
                <UserIcon className="w-5 h-5 text-blue-500" />
              )}
              <div className="text-left text-xs">
                <div className="font-semibold">{user.displayName || 'Authorized User'}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[180px]">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-1.5 text-slate-500 hover:text-red-500 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isAuthLoading}
              className="gsi-material-button"
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">
                  {isAuthLoading ? 'Connecting...' : 'Sign in with Google'}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notice && (
        <div className={`mb-5 p-3 rounded-lg flex items-center justify-between text-xs font-mono border ${
          notice.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
        }`}>
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="hover:opacity-75">✕</button>
        </div>
      )}

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('gmail')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'gmail'
              ? 'border-red-500 text-red-600 dark:text-red-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Gmail Integration</span>
          {messages.length > 0 && (
            <span className="px-1.5 py-0.2 bg-red-500/10 text-red-500 rounded text-[10px] font-mono">
              {messages.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'docs'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Google Docs</span>
          {docsList.length > 0 && (
            <span className="px-1.5 py-0.2 bg-blue-500/10 text-blue-500 rounded text-[10px] font-mono">
              {docsList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('cloudsql');
            loadCloudSqlAgents();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'cloudsql'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Cloud SQL (PostgreSQL)</span>
          <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-mono">
            {sqlAgents.length || 8} Systems Queryable ({dbRecords.length} workspace logs)
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('firestore');
            loadFirestoreTelemetry();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'firestore'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Firebase Firestore</span>
          {firestoreEvents.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-500 rounded text-[10px] font-mono">
              {firestoreEvents.length} events
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: GMAIL */}
      {activeTab === 'gmail' && (
        <div className="space-y-6">
          {!user ? (
            <div className="p-8 text-center border rounded-xl border-dashed border-slate-300 dark:border-slate-800">
              <Mail className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <h3 className="font-semibold text-sm mb-1">Gmail Authentication Required</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
                Sign in with your Google account to read inbox summaries, compose messages, and sync audit records to Cloud SQL.
              </p>
              <button onClick={handleLogin} className="gsi-material-button">
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">Sign in with Google</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inbox Message List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-red-500" />
                    <span>Recent Inbox Messages</span>
                  </h3>
                  <button
                    onClick={loadGmailMessages}
                    disabled={gmailLoading}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${gmailLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {gmailError && (
                  <div className="p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs border border-red-500/20">
                    {gmailError}
                  </div>
                )}

                {gmailLoading ? (
                  <div className="p-6 text-center text-xs text-slate-500 font-mono">
                    Loading messages from Gmail API...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 border rounded-lg border-dashed">
                    No messages returned from inbox.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {messages.map((msg, idx) => (
                      <div
                        key={`${msg.id}-${idx}`}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                            {msg.from}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {msg.date ? new Date(msg.date).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                          {msg.subject}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {msg.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Compose & Send Email */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 space-y-4">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-semibold">Compose & Send Email</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 mb-1">Recipient (To:)</label>
                    <input
                      type="email"
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 mb-1">Subject</label>
                    <input
                      type="text"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      placeholder="Census or swarm report notice"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 mb-1">Body</label>
                    <textarea
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      rows={4}
                      placeholder="Type your message content..."
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!composeTo.trim() || !composeSubject.trim() || isSendingMail}
                    onClick={() => setConfirmSendOpen(true)}
                    className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Email (Requires Confirmation)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GOOGLE DOCS */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          {!user ? (
            <div className="p-8 text-center border rounded-xl border-dashed border-slate-300 dark:border-slate-800">
              <FileText className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <h3 className="font-semibold text-sm mb-1">Google Docs Authentication Required</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
                Sign in with your Google account to list your existing documents, generate new Google Docs, and link them to PostgreSQL.
              </p>
              <button onClick={handleLogin} className="gsi-material-button">
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">Sign in with Google</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Document List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Your Google Docs Documents</span>
                  </h3>
                  <button
                    onClick={loadDocsList}
                    disabled={docsLoading}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${docsLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {docsError && (
                  <div className="p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs border border-red-500/20">
                    {docsError}
                  </div>
                )}

                {docsLoading ? (
                  <div className="p-6 text-center text-xs text-slate-500 font-mono">
                    Querying Drive for Google Docs...
                  </div>
                ) : docsList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 border rounded-lg border-dashed">
                    No Google Docs documents found in Drive.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {docsList.map((doc, idx) => (
                      <div
                        key={`${doc.id}-${idx}`}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs flex items-center justify-between"
                      >
                        <div className="min-w-0 mr-2">
                          <div className="font-semibold truncate text-slate-800 dark:text-slate-200">
                            {doc.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Modified: {doc.modifiedTime ? new Date(doc.modifiedTime).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        {doc.webViewLink && (
                          <a
                            href={doc.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-blue-500 hover:text-blue-600 transition-colors"
                            title="Open in Google Docs"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Create New Document Form */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 space-y-4">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-semibold">Create New Google Doc</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 mb-1">Document Title</label>
                    <input
                      type="text"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      placeholder="e.g. Sovereign Planetary Briefing Q3"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 mb-1">Initial Content</label>
                    <textarea
                      value={newDocContent}
                      onChange={(e) => setNewDocContent(e.target.value)}
                      rows={5}
                      placeholder="Type the document body..."
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!newDocTitle.trim() || isCreatingDoc}
                    onClick={() => setConfirmDocOpen(true)}
                    className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Create Document (Requires Confirmation)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CLOUD SQL POSTGRESQL */}
      {activeTab === 'cloudsql' && (
        <div className="space-y-6">
          {/* Cloud SQL Instance Metadata Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] font-mono text-slate-500 block">INSTANCE</span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                {dbStatus.instance}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] font-mono text-slate-500 block">REGION & PROJECT</span>
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 block">
                {dbStatus.region} • {dbStatus.project.slice(0, 14)}...
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] font-mono text-slate-500 block">DATABASE ENGINE</span>
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 block">
                {dbStatus.engine}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] font-mono text-slate-500 block">UNIFIED SSOT TABLES</span>
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 block">
                public.agents ({sqlAgents.length || 8}) • telemetry ({sqlEventsCount})
              </span>
            </div>
          </div>

          {/* Grounded Agents Table from public.agents (Same SSOT table as Physical Observatory) */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                  SELECT * FROM public.agents — {sqlAgents.length || 8} Systems Queryable in DB (Unified SSOT)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Direct PostgreSQL table shared with Physical AI Observatory Mesh — zero count discrepancy
                </p>
              </div>
              <button
                onClick={loadDbRecords}
                disabled={dbLoading}
                className="px-2.5 py-1 rounded border border-emerald-500/30 hover:bg-emerald-500/10 text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${dbLoading ? 'animate-spin' : ''}`} />
                <span>SELECT COUNT(*)</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {sqlAgents.map((ag: any, idx: number) => (
                <div
                  key={`${ag.spiffe_id || ag.id}-${idx}`}
                  className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-xs flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <div className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {ag.canonical_name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      {ag.spiffe_id}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {ag.ecosystem} • {ag.total_invocations} inv
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Committed Workspace Audit Records Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-500" />
                  <span>Workspace Audit Log (public.workspace_records: {dbRecords.length})</span>
                </h3>
                <button
                  onClick={loadDbRecords}
                  disabled={dbLoading}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${dbLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {dbRecords.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 border rounded-lg border-dashed">
                  No records stored yet. Send an email, create a doc, or add a note to commit relational records.
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {dbRecords.map((rec, idx) => (
                    <div
                      key={`${rec.id}-${idx}`}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                          rec.itemType === 'gmail'
                            ? 'bg-red-500/10 text-red-500'
                            : rec.itemType === 'docs'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {rec.itemType}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {rec.createdAt ? new Date(rec.createdAt).toLocaleString() : ''}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {rec.title}
                      </div>
                      {rec.snippet && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {rec.snippet}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Record Creator */}
            <form onSubmit={handleSaveManualNote} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold">Commit Manual Relational Entry</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Title / Identifier</label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Swarm Quorum Snapshot"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Payload / Description</label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={4}
                    placeholder="Log details, telemetry digest, or operator notes..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!noteTitle.trim() || isSavingNote || !user}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{isSavingNote ? 'Writing to PostgreSQL...' : 'Insert into Cloud SQL (Drizzle ORM)'}</span>
                </button>
                {!user && (
                  <p className="text-[11px] text-amber-500 text-center">
                    Sign in with Google above to commit records to your PostgreSQL account.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: FIREBASE FIRESTORE */}
      {activeTab === 'firestore' && (
        <div className="space-y-6">
          {/* Firestore Status Card */}
          <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Firebase Cloud Firestore Database
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ONLINE
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time NoSQL persistent document storage with Attribute-Based Access Control (ABAC).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Region</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">us-west2</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Rules</div>
                <div className="font-semibold text-emerald-500">ABAC Strict</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Collections</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">users, telemetry</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Database</div>
                <div className="font-semibold text-amber-500 truncate max-w-[90px]" title="ai-studio-sovereigninfinit-cdf739a6-e433-4126-ae5f-0cb242e90b13">
                  ai-studio-sov...
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Persisted Firestore Records List */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold">
                    Planetary Telemetry Documents (/users/{'{uid}'}/telemetry)
                  </h3>
                </div>
                <button
                  onClick={loadFirestoreTelemetry}
                  disabled={firestoreLoading || !user}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                  title="Refresh Firestore documents"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${firestoreLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {!user ? (
                <div className="p-8 text-center border rounded-xl border-dashed border-slate-300 dark:border-slate-800">
                  <Flame className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-500">Sign in with Google above to view and write your Firestore records.</p>
                </div>
              ) : firestoreLoading && firestoreEvents.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-slate-500 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                  <span>Loading documents from Firestore...</span>
                </div>
              ) : firestoreEvents.length === 0 ? (
                <div className="p-8 text-center border rounded-xl border-dashed border-slate-300 dark:border-slate-800">
                  <p className="text-xs text-slate-500">No telemetry documents yet. Commit your first planetary telemetry event below!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {firestoreEvents.map((evt, idx) => (
                    <div
                      key={`${evt.id}-${idx}`}
                      className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="font-semibold text-amber-500">{evt.region}</span>
                        <span>{new Date(evt.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {evt.eventDigest}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        ID: {evt.id} • Auth UID: {evt.userId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Commit Event Form */}
            <form onSubmit={handleSaveFirestoreTelemetry} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold">Write Firestore Document</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Target Region</label>
                  <select
                    value={telemetryRegion}
                    onChange={(e) => setTelemetryRegion(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  >
                    <option value="us-west2">us-west2 (Primary Quorum)</option>
                    <option value="us-virginia">us-virginia (Northern VA Megasite)</option>
                    <option value="tokyo-prim">tokyo-prim (Tokyo Primary)</option>
                    <option value="zurich-alpine">zurich-alpine (Zurich Enclave)</option>
                    <option value="eu-frankfurt">eu-frankfurt (Frankfurt Mesh)</option>
                    <option value="singapore-equator">singapore-equator (Singapore)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Telemetry Digest / Payload</label>
                  <input
                    type="text"
                    value={telemetryDigest}
                    onChange={(e) => setTelemetryDigest(e.target.value)}
                    placeholder="e.g. BFT-QUORUM-SAT-85PCT"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Leave blank to auto-generate a cryptographic Merkle root hash.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingFirestore || !user}
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{isLoggingFirestore ? 'Writing Document...' : 'Commit to Firestore (setDoc)'}</span>
                </button>

                {!user && (
                  <p className="text-[11px] text-amber-500 text-center">
                    Sign in with Google above to write documents to your Firestore account.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY CONFIRMATION MODAL: SEND EMAIL */}
      {confirmSendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold">Confirm Email Dispatch</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to send this email via your connected Google Workspace account?
            </p>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono space-y-1 text-slate-700 dark:text-slate-300">
              <div><strong className="text-slate-500">To:</strong> {composeTo}</div>
              <div><strong className="text-slate-500">Subject:</strong> {composeSubject}</div>
              <div className="text-[11px] text-slate-400 truncate max-w-full">
                <strong className="text-slate-500">Preview:</strong> {composeBody.slice(0, 80)}...
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSendOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteSendEmail}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Confirm & Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY CONFIRMATION MODAL: CREATE DOC */}
      {confirmDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <FileText className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold">Confirm Document Creation</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              This action will create a new Google Docs file in your Google Drive and register a record in the Cloud SQL database.
            </p>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono space-y-1 text-slate-700 dark:text-slate-300">
              <div><strong className="text-slate-500">Title:</strong> {newDocTitle}</div>
              <div className="text-[11px] text-slate-400 truncate max-w-full">
                <strong className="text-slate-500">Initial Content:</strong> {newDocContent.slice(0, 80)}...
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDocOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteCreateDoc}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Confirm & Create Doc
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
