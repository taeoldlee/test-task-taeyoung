import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.createTable('programs')
		.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
		.addColumn('name', 'varchar(255)', (col) => col.notNull())
		.addColumn('partner', 'varchar(255)')
		.addColumn('cohortSize', 'integer')
		.addColumn('isActive', 'boolean', (col) => col.notNull().defaultTo(true))
		.addColumn('createdAt', 'timestamp', (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
		)
		.addColumn('updatedAt', 'timestamp', (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
		)
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable('programs').execute();
}
