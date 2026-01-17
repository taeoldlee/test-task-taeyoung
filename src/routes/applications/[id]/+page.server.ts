import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import { APPLICATION_STATUSES, type ApplicationStatus } from '$lib/server/db/types';

export const load: PageServerLoad = async ({ params, url }) => {
	const id = parseInt(params.id);
	const returnUrl = url.searchParams.get('returnUrl') || '/applications';

	const application = await db
		.selectFrom('applications')
		.innerJoin('programs', 'programs.id', 'applications.programId')
		.select([
			'applications.id',
			'applications.programId',
			'applications.firstName',
			'applications.lastName',
			'applications.email',
			'applications.jobRole',
			'applications.country',
			'applications.startupName',
			'applications.websiteUrl',
			'applications.productDescription',
			'applications.industry',
			'applications.businessModel',
			'applications.stage',
			'applications.status',
			'applications.createdAt',
			'applications.updatedAt',
			'programs.name as programName',
			'programs.partner as programPartner',
			'programs.isActive as programIsActive'
		])
		.where('applications.id', '=', id)
		.executeTakeFirst();

	if (!application) {
		throw error(404, 'Application not found');
	}

	const notes = await db
		.selectFrom('notes')
		.selectAll()
		.where('applicationId', '=', id)
		.orderBy('createdAt', 'desc')
		.execute();

	return {
		application,
		notes,
		returnUrl,
		statuses: APPLICATION_STATUSES
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, params }) => {
		const formData = await request.formData();
		const status = formData.get('status') as ApplicationStatus;
		const id = parseInt(params.id);

		if (!status) {
			return fail(400, { error: 'Status is required' });
		}

		if (!APPLICATION_STATUSES.includes(status)) {
			return fail(400, { error: 'Invalid status' });
		}

		await db
			.updateTable('applications')
			.set({ status })
			.where('id', '=', id)
			.execute();

		return { success: true };
	},

	addNote: async ({ request, params }) => {
		const formData = await request.formData();
		const authorName = formData.get('authorName')?.toString().trim();
		const content = formData.get('content')?.toString().trim();
		const applicationId = parseInt(params.id);

		if (!authorName || !content) {
			return fail(400, { error: 'Author name and content are required' });
		}

		await db
			.insertInto('notes')
			.values({
				applicationId,
				authorName,
				content
			})
			.execute();

		return { success: true };
	},

	deleteNote: async ({ request }) => {
		const formData = await request.formData();
		const noteId = formData.get('noteId');

		if (!noteId) {
			return fail(400, { error: 'Note ID is required' });
		}

		await db
			.deleteFrom('notes')
			.where('id', '=', parseInt(noteId.toString()))
			.execute();

		return { success: true };
	}
};
