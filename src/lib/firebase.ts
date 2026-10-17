import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  Firestore,
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Parse configuration from firebase-applet-config.json
export const firebaseConfig = {
  projectId: firebaseConfigJson.projectId,
  appId: firebaseConfigJson.appId,
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  firestoreDatabaseId: (firebaseConfigJson as any).firestoreDatabaseId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  measurementId: firebaseConfigJson.measurementId,
  oAuthClientId: (firebaseConfigJson as any).oAuthClientId,
};

// Initialize Firebase App instance
export const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize and export Auth instance
export const auth: Auth = getAuth(app);

// Initialize and export Firestore instance (using designated named database if present)
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Export firestore alias
export const firestore: Firestore = db;

// Initialize and export Storage instance
export const storage: FirebaseStorage = getStorage(app);

export const googleAuthProvider = new GoogleAuthProvider();

// Scopes confirmed in UI for Gmail and Google Docs
export const WORKSPACE_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
];

WORKSPACE_SCOPES.forEach((scope) => {
  googleAuthProvider.addScope(scope);
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;
let cachedIdToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, accessToken: string | null, idToken: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      try {
        const idToken = await user.getIdToken();
        cachedIdToken = idToken;
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken, cachedIdToken);
      } catch (err) {
        console.error('Error getting idToken:', err);
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken, null);
      }
    } else {
      cachedAccessToken = null;
      cachedIdToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{
  user: User;
  accessToken: string;
  idToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleAuthProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      console.warn('No access token returned in credential, proceeding with ID token');
    }
    cachedAccessToken = credential?.accessToken || null;
    const idToken = await result.user.getIdToken();
    cachedIdToken = idToken;
    await syncUserProfileToFirestore(result.user);
    return {
      user: result.user,
      accessToken: cachedAccessToken || '',
      idToken: cachedIdToken,
    };
  } catch (error: any) {
    console.error('Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const syncUserProfileToFirestore = async (user: User) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore sync user notice:', err);
  }
};

export const logTelemetryEventToFirestore = async (
  userId: string,
  region: string,
  eventDigest: string
) => {
  try {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const eventRef = doc(db, 'users', userId, 'telemetry', eventId);
    await setDoc(eventRef, {
      userId,
      region,
      eventDigest,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore telemetry log notice:', err);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const getIdToken = async (): Promise<string | null> => {
  if (auth.currentUser) {
    cachedIdToken = await auth.currentUser.getIdToken();
  }
  return cachedIdToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  cachedIdToken = null;
};

export default {
  app,
  auth,
  db,
  firestore,
  storage,
};
