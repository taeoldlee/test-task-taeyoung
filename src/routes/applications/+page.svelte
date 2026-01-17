<script lang="ts">
	import ProgramFilter from '$lib/components/ProgramFilter.svelte';
	import StatusFilter from '$lib/components/StatusFilter.svelte';
	import ApplicationTable from '$lib/components/ApplicationTable.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { Button } from '$lib/components/ui/button';
	import { buildQueryString } from '$lib/utils';
	import { APPLICATION_STATUSES, STATUS_LABELS } from '$lib/types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let selectedIds = $state<number[]>([]);
	let bulkStatus = $state<string>('');

	const currentUrl = $derived(`/applications${buildQueryString({
		programId: data.filters.programId,
		status: data.filters.status,
		page: data.pagination.page
	})}`);

	function handleSelectionChange(ids: number[]) {
		selectedIds = ids;
	}

	function clearSelection() {
		selectedIds = [];
		bulkStatus = '';
	}
</script>

<svelte:head>
	<title>Applications | TRMNL4 Admin Panel</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<h1 class="text-2xl font-bold text-gray-900">Applications</h1>
		<div class="flex gap-3">
			<ProgramFilter
				programs={data.programs}
				selectedProgramId={data.filters.programId}
				currentStatus={data.filters.status}
			/>
			<StatusFilter
				selectedStatus={data.filters.status}
				currentProgramId={data.filters.programId}
			/>
		</div>
	</div>

	{#if selectedIds.length > 0}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
			<span class="text-sm text-blue-800 font-medium">
				{selectedIds.length} application{selectedIds.length > 1 ? 's' : ''} selected
			</span>
			<div class="flex items-center gap-3">
				<form
					method="POST"
					action="?/bulkUpdateStatus"
					use:enhance={() => {
						const count = selectedIds.length;
						const newStatus = bulkStatus;
						return async ({ result, update }) => {
							if (result.type === 'success') {
								toast.success(`Updated ${count} application${count > 1 ? 's' : ''} to ${STATUS_LABELS[newStatus as keyof typeof STATUS_LABELS]}`);
								clearSelection();
							} else {
								toast.error('Failed to update applications');
							}
							await update({ reset: false });
						};
					}}
					class="flex items-center gap-2"
				>
					<input type="hidden" name="ids" value={selectedIds.join(',')} />
					<select
						name="status"
						bind:value={bulkStatus}
						class="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Change status to...</option>
						{#each APPLICATION_STATUSES as status}
							<option value={status}>{STATUS_LABELS[status]}</option>
						{/each}
					</select>
					<Button type="submit" size="sm" disabled={!bulkStatus}>
						Apply
					</Button>
				</form>
				<Button variant="outline" size="sm" onclick={clearSelection}>
					Clear
				</Button>
			</div>
		</div>
	{/if}

	<div class="bg-white rounded-lg shadow">
		<ApplicationTable
			applications={data.applications}
			showProgram={!data.filters.programId}
			returnUrl={currentUrl}
			{selectedIds}
			onSelectionChange={handleSelectionChange}
			sortField={data.sorting.field}
			sortDirection={data.sorting.direction}
		/>
		<Pagination
			{...data.pagination}
			baseUrl="/applications"
			filters={{
				programId: data.filters.programId,
				status: data.filters.status,
				sort: data.sorting.field,
				dir: data.sorting.direction,
				pageSize: data.pagination.pageSize
			}}
		/>
	</div>
</div>
