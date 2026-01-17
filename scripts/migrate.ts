import { Kysely, Migrator, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import { config } from 'dotenv';
config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	console.error('DATABASE_URL environment variable is not set');
	process.exit(1);
}

const dialect = new MysqlDialect({
	pool: createPool({
		uri: DATABASE_URL,
		waitForConnections: true,
		connectionLimit: 10
	})
});

const db = new Kysely<unknown>({ dialect });

async function migrateToLatest() {
	const migrator = new Migrator({
		db,
		provider: {
			async getMigrations() {
				const migrationsDir = path.join(__dirname, '../src/lib/server/db/migrations');
				const files = await fs.readdir(migrationsDir);
				const migrations: Record<string, { up: (db: Kysely<unknown>) => Promise<void>; down: (db: Kysely<unknown>) => Promise<void> }> = {};

				for (const file of files.filter((f) => f.endsWith('.ts'))) {
					const migration = await import(path.join(migrationsDir, file));
					const name = file.replace('.ts', '');
					migrations[name] = migration;
				}

				return migrations;
			}
		}
	});

	console.log('Running migrations...');

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(`  ✓ Migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === 'Error') {
			console.error(`  ✗ Failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error('Failed to migrate');
		console.error(error);
		await db.destroy();
		process.exit(1);
	}

	if (!results || results.length === 0) {
		console.log('No migrations to run - database is up to date');
	}

	await db.destroy();
	console.log('Migration complete');
}

migrateToLatest();
