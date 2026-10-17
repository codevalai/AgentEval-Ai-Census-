import { db } from './index.ts';
import { workspaceRecords, users } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface CreateWorkspaceRecordInput {
  userId: number;
  itemType: 'gmail' | 'docs' | 'telemetry';
  title: string;
  externalId?: string;
  snippet?: string;
}

export async function insertWorkspaceRecord(input: CreateWorkspaceRecordInput) {
  try {
    const result = await db
      .insert(workspaceRecords)
      .values({
        userId: input.userId,
        itemType: input.itemType,
        title: input.title,
        externalId: input.externalId,
        snippet: input.snippet,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert workspace record:', error);
    throw new Error('Database insert failed. Please try again later.', { cause: error });
  }
}

export async function getWorkspaceRecordsByUserUid(uid: string) {
  try {
    const records = await db
      .select({
        id: workspaceRecords.id,
        itemType: workspaceRecords.itemType,
        title: workspaceRecords.title,
        externalId: workspaceRecords.externalId,
        snippet: workspaceRecords.snippet,
        createdAt: workspaceRecords.createdAt,
      })
      .from(workspaceRecords)
      .innerJoin(users, eq(workspaceRecords.userId, users.id))
      .where(eq(users.uid, uid))
      .orderBy(desc(workspaceRecords.createdAt));

    return records;
  } catch (error) {
    console.error('Failed to get workspace records:', error);
    throw new Error('Database select failed. Please try again later.', { cause: error });
  }
}
