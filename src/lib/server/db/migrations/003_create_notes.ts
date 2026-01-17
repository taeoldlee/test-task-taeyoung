import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.createTable('notes')
		.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
		.addColumn('applicationId', 'integer', (col) => col.notNull())
		.addColumn('authorName', 'varchar(255)', (col) => col.notNull())
		.addColumn('content', 'text', (col) => col.notNull())
		.addColumn('createdAt', 'timestamp', (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
		)
		.addForeignKeyConstraint('fk_note_application', ['applicationId'], 'applications', ['id'], (cb) =>
			cb.onDelete('cascade')
		)
		.execute();

	// Add index for faster lookups
	await db.schema
		.createIndex('idx_notes_applicationId')
		.on('notes')
		.column('applicationId')
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable('notes').execute();
}
