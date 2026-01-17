<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { buildQueryString } from '$lib/utils';
	import { goto } from '$app/navigation';

	interface Props {
		page: number;
		pageSize: number;
		pageSizeOptions?: number[];
		totalCount: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
		baseUrl?: string;
		filters?: Record<string, string | number | null>;
	}

	let {
		page,
		pageSize,
		pageSizeOptions = [20, 50, 100],
		totalCount,
		totalPages,
		hasNext,
		hasPrev,
		baseUrl = '',
		filters = {}
	}: Props = $props();

	const start = $derived((page - 1) * pageSize + 1);
	const end = $derived(Math.min(page * pageSize, totalCount));

	function getPageUrl(pageNum: number, newPageSize?: number) {
		return `${baseUrl}${buildQueryString({ ...filters, page: pageNum, pageSize: newPageSize ?? pageSize })}`;
	}

	function handlePageSizeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newPageSize = parseInt(target.value);
		// Reset to page 1 when changing page size
		goto(getPageUrl(1, newPageSize));
	}
</script>

{#if totalCount > 0}
	<div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
		<div class="flex flex-1 justify-between sm:hidden">
			{#if hasPrev}
				<a href={getPageUrl(page - 1)} class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
					Previous
				</a>
			{/if}
			{#if hasNext}
				<a href={getPageUrl(page + 1)} class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
					Next
				</a>
			{/if}
		</div>
		<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
			<div class="flex items-center gap-4">
				<p class="text-sm text-gray-700">
					Showing <span class="font-medium">{start}</span> to <span class="font-medium">{end}</span> of
					<span class="font-medium">{totalCount}</span> applications
				</p>
				<div class="flex items-center gap-2">
					<label for="pageSize" class="text-sm text-gray-600">Show:</label>
					<select
						id="pageSize"
						value={pageSize}
						onchange={handlePageSizeChange}
						class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{#each pageSizeOptions as size}
							<option value={size}>{size}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="flex gap-2">
				{#if hasPrev}
					<a href={getPageUrl(page - 1)}>
						<Button variant="outline" size="sm">Previous</Button>
					</a>
				{:else}
					<Button variant="outline" size="sm" disabled>Previous</Button>
				{/if}
				<span class="flex items-center px-3 text-sm text-gray-700">
					Page {page} of {totalPages}
				</span>
				{#if hasNext}
					<a href={getPageUrl(page + 1)}>
						<Button variant="outline" size="sm">Next</Button>
					</a>
				{:else}
					<Button variant="outline" size="sm" disabled>Next</Button>
				{/if}
			</div>
		</div>
	</div>
{/if}
