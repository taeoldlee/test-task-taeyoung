import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'kysely';

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim() || '';
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const offset = (page - 1) * PAGE_SIZE;

	if (!query) {
		return {
			query: '',
			applications: [],
			pagination: {
				page: 1,
				pageSize: PAGE_SIZE,
				totalCount: 0,
				totalPages: 0,
				hasNext: false,
				hasPrev: false
			}
		};
	}

	const searchPattern = `%${query}%`;

	// Count total matching applications
	const countResult = await db
		.selectFrom('applications')
		.leftJoin('notes', 'notes.applicationId', 'applications.id')
		.select(db.fn.count(db.fn('DISTINCT', ['applications.id'])).as('count'))
		.where((eb) =>
			eb.or([
				eb('applications.startupName', 'like', searchPattern),
				eb('applications.firstName', 'like', searchPattern),
				eb('applications.lastName', 'like', searchPattern),
				eb('applications.email', 'like', searchPattern),
				sql<boolean>`applications.industry LIKE ${searchPattern}`,
				sql<boolean>`applications.stage LIKE ${searchPattern}`,
				eb('applications.productDescription', 'like', searchPattern),
				eb('notes.content', 'like', searchPattern)
			])
		)
		.executeTakeFirst();

	const totalCount = Number(countResult?.count || 0);
	const totalPages = Math.ceil(totalCount / PAGE_SIZE);

	// Get matching applications
	const applications = await db
		.selectFrom('applications')
		.innerJoin('programs', 'programs.id', 'applications.programId')
		.leftJoin('notes', 'notes.applicationId', 'applications.id')
		.select([
			'applications.id',
			'applications.firstName',
			'applications.lastName',
			'applications.email',
			'applications.startupName',
			'applications.industry',
			'applications.stage',
			'applications.status',
			'applications.createdAt',
			'programs.name as programName'
		])
		.where((eb) =>
			eb.or([
				eb('applications.startupName', 'like', searchPattern),
				eb('applications.firstName', 'like', searchPattern),
				eb('applications.lastName', 'like', searchPattern),
				eb('applications.email', 'like', searchPattern),
				sql<boolean>`applications.industry LIKE ${searchPattern}`,
				sql<boolean>`applications.stage LIKE ${searchPattern}`,
				eb('applications.productDescription', 'like', searchPattern),
				eb('notes.content', 'like', searchPattern)
			])
		)
		.groupBy('applications.id')
		.orderBy('applications.createdAt', 'desc')
		.limit(PAGE_SIZE)
		.offset(offset)
		.execute();

	return {
		query,
		applications,
		pagination: {
			page,
			pageSize: PAGE_SIZE,
			totalCount,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1
		}
	};
};
