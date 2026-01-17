import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.createTable('applications')
		.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
		.addColumn('programId', 'integer', (col) => col.notNull())
		// Founder info
		.addColumn('firstName', 'varchar(255)', (col) => col.notNull())
		.addColumn('lastName', 'varchar(255)', (col) => col.notNull())
		.addColumn('email', 'varchar(255)', (col) => col.notNull())
		.addColumn(
			'jobRole',
			sql`ENUM('founder', 'co_founder', 'ceo', 'coo', 'cfo', 'cto', 'cmo', 'cpo', 'cro', 'cgo', 'other')`,
			(col) => col.notNull()
		)
		.addColumn('country', 'varchar(100)', (col) => col.notNull())
		// Company info
		.addColumn('startupName', 'varchar(255)', (col) => col.notNull())
		.addColumn('websiteUrl', 'varchar(500)')
		.addColumn('productDescription', 'text')
		.addColumn(
			'industry',
			sql`ENUM('adtech', 'agritech', 'ai_ml', 'apps', 'ar_vr', 'b2b_software', 'deep_tech', 'ecommerce', 'edtech', 'energy', 'fintech', 'gamedev', 'hardware', 'healthtech', 'hr_tech', 'legaltech', 'mobility', 'security', 'socialtech', 'web3', 'other')`,
			(col) => col.notNull()
		)
		.addColumn('businessModel', sql`ENUM('b2c', 'b2b', 'b2b2c', 'other')`, (col) => col.notNull())
		.addColumn(
			'stage',
			sql`ENUM('pre_seed', 'seed', 'series_a', 'series_b', 'growth', 'other')`,
			(col) => col.notNull()
		)
		// Admin fields
		.addColumn('status', sql`ENUM('new', 'reviewed', 'accepted', 'rejected')`, (col) =>
			col.notNull().defaultTo('new')
		)
		.addColumn('createdAt', 'timestamp', (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
		)
		.addColumn('updatedAt', 'timestamp', (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
		)
		.addForeignKeyConstraint('fk_application_program', ['programId'], 'programs', ['id'], (cb) =>
			cb.onDelete('cascade')
		)
		.execute();

	// Add index for faster lookups
	await db.schema
		.createIndex('idx_applications_programId')
		.on('applications')
		.column('programId')
		.execute();

	await db.schema
		.createIndex('idx_applications_status')
		.on('applications')
		.column('status')
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable('applications').execute();
}
