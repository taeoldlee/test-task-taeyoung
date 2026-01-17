import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { APPLICATION_STATUSES, type ApplicationStatus } from '$lib/server/db/types';

const DEFAULT_PAGE_SIZE = 20;
const VALID_PAGE_SIZES = [20, 50, 100];

type SortField = 'startupName' | 'lastName' | 'industry' | 'stage' | 'programName' | 'createdAt' | 'status';
const VALID_SORT_FIELDS: SortField[] = ['startupName', 'lastName', 'industry', 'stage', 'programName', 'createdAt', 'status'];

export const load: PageServerLoad = async ({ url }) => {
	const programId = url.searchParams.get('programId');
	const status = url.searchParams.get('status') as ApplicationStatus | null;
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const requestedPageSize = parseInt(url.searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE));
	const pageSize = VALID_PAGE_SIZES.includes(requestedPageSize) ? requestedPageSize : DEFAULT_PAGE_SIZE;
	const offset = (page - 1) * pageSize;
	const sortField = url.searchParams.get('sort') as SortField | null;
	const sortDirection = (url.searchParams.get('dir') || 'desc') as 'asc' | 'desc';

	// Get all programs for the dropdown
	const programs = await db
		.selectFrom('programs')
		.selectAll()
		.orderBy('createdAt', 'desc')
		.execute();

	// Build applications query with filters
	let countQuery = db
		.selectFrom('applications')
		.select(db.fn.count('id').as('count'));

	let applicationsQuery = db
		.selectFrom('applications')
		.innerJoin('programs', 'programs.id', 'applications.programId')
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
		.limit(pageSize)
		.offset(offset);

	// Apply sorting
	if (sortField && VALID_SORT_FIELDS.includes(sortField)) {
		const columnMap: Record<SortField, string> = {
			startupName: 'applications.startupName',
			lastName: 'applications.firstName',  // Sort by firstName for better UX since display shows "FirstName LastName"
			industry: 'applications.industry',
			stage: 'applications.stage',
			programName: 'programs.name',
			createdAt: 'applications.createdAt',
			status: 'applications.status'
		};
		applicationsQuery = applicationsQuery.orderBy(columnMap[sortField] as any, sortDirection);
	} else {
		applicationsQuery = applicationsQuery.orderBy('applications.createdAt', 'desc');
	}

	// Apply filters
	if (programId) {
		const pid = parseInt(programId);
		applicationsQuery = applicationsQuery.where('applications.programId', '=', pid);
		countQuery = countQuery.where('programId', '=', pid);
	}

	if (status && APPLICATION_STATUSES.includes(status)) {
		applicationsQuery = applicationsQuery.where('applications.status', '=', status);
		countQuery = countQuery.where('status', '=', status);
	}

	const [applications, countResult] = await Promise.all([
		applicationsQuery.execute(),
		countQuery.executeTakeFirst()
	]);

	const totalCount = Number(countResult?.count || 0);
	const totalPages = Math.ceil(totalCount / pageSize);

	return {
		programs,
		applications,
		pagination: {
			page,
			pageSize,
			pageSizeOptions: VALID_PAGE_SIZES,
			totalCount,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1
		},
		filters: {
			programId: programId ? parseInt(programId) : null,
			status
		},
		sorting: {
			field: sortField,
			direction: sortDirection
		}
	};
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const status = formData.get('status') as ApplicationStatus;

		if (!id || !status) {
			return fail(400, { error: 'Missing required fields' });
		}

		if (!APPLICATION_STATUSES.includes(status)) {
			return fail(400, { error: 'Invalid status' });
		}

		await db
			.updateTable('applications')
			.set({ status })
			.where('id', '=', parseInt(id.toString()))
			.execute();

		return { success: true };
	},

	bulkUpdateStatus: async ({ request }) => {
		const formData = await request.formData();
		const idsString = formData.get('ids')?.toString();
		const status = formData.get('status') as ApplicationStatus;

		if (!idsString || !status) {
			return fail(400, { error: 'Missing required fields' });
		}

		if (!APPLICATION_STATUSES.includes(status)) {
			return fail(400, { error: 'Invalid status' });
		}

		const ids = idsString.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

		if (ids.length === 0) {
			return fail(400, { error: 'No valid IDs provided' });
		}

		await db
			.updateTable('applications')
			.set({ status })
			.where('id', 'in', ids)
			.execute();

		return { success: true, updatedCount: ids.length };
	}
};
