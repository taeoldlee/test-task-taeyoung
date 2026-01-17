import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import type { Database } from './types';
import { DATABASE_URL } from '$env/static/private';

// Create a mysql2 pool that Kysely can use
// Type assertion needed because mysql2's Pool type doesn't perfectly match Kysely's MysqlPool interface
// but they are compatible at runtime
const pool = createPool({
	uri: DATABASE_URL,
	waitForConnections: true,
	connectionLimit: 10,
	timezone: 'Z' // Tell mysql2 that timestamps are in UTC
});

const dialect = new MysqlDialect({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pool: pool as any
});

export const db = new Kysely<Database>({ dialect });
