/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PostgreSQL connection pool and Drizzle ORM client initialization.
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
      ssl: process.env.SQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });

    global._postgresPool.on('error', (err) => {
      // Gracefully handle idle client disconnects
      if (err.message && err.message.includes('Connection terminated unexpectedly')) {
        console.warn('[Database] Idle SQL pool client connection terminated unexpectedly (auto-reconnecting on next query).');
      } else {
        console.error('Unexpected error on idle SQL pool client:', err);
      }
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
