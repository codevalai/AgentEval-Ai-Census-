import { adminAuth } from './firebase-admin.ts';
import { getOrCreateUser } from '../db/users.ts';
import {
  insertWorkspaceRecord,
  getWorkspaceRecordsByUserUid,
} from '../db/workspaceRecords.ts';

export async function verifyAndGetUser(authHeader?: string) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid token format');
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const dbUser = await getOrCreateUser(decodedToken.uid, decodedToken.email || 'unknown@workspace.user');
    return { decodedToken, dbUser };
  } catch (err: any) {
    console.error('Firebase token verification or DB sync error:', err);
    throw new Error('Unauthorized: Authentication verification failed', { cause: err });
  }
}

export async function handleGetRecords(authHeader?: string) {
  const { decodedToken } = await verifyAndGetUser(authHeader);
  return await getWorkspaceRecordsByUserUid(decodedToken.uid);
}

export async function handleCreateRecord(
  authHeader: string | undefined,
  data: { itemType: 'gmail' | 'docs' | 'telemetry'; title: string; externalId?: string; snippet?: string }
) {
  const { dbUser } = await verifyAndGetUser(authHeader);
  return await insertWorkspaceRecord({
    userId: dbUser.id,
    itemType: data.itemType,
    title: data.title,
    externalId: data.externalId,
    snippet: data.snippet,
  });
}
