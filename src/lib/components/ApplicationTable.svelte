<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import StatusDropdown from './StatusDropdown.svelte';
	import { formatDate } from '$lib/utils';
	import { INDUSTRY_LABELS, STAGE_LABELS, type ApplicationStatus } from '$lib/types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { toast } from '$lib/stores/toast';

	function copyEmail(email: string) {
		navigator.clipboard.writeText(email);
		toast.success('Email copied');
	}

	interface Application {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		startupName: string;
		industry: string;
		stage: string;
		status: ApplicationStatus;
		createdAt: Date;
		programName: string;
	}

	interface Props {
		applications: Application[];
		showProgram?: boolean;
		returnUrl?: string;
		selectedIds?: number[];
		onSelectionChange?: (ids: number[]) => void;
		sortField?: string | null;
		sortDirection?: 'asc' | 'desc';
	}

	let {
		applications,
		showProgram = false,
		returnUrl = '',
		selectedIds = [],
		onSelectionChange,
		sortField = null,
		sortDirection = 'desc'
	}: Props = $props();

	let allSelected = $derived(
		applications.length > 0 && applications.every(app => selectedIds.includes(app.id))
	);

	function toggleAll() {
		if (allSelected) {
			onSelectionChange?.([]);
		} else {
			onSelectionChange?.(applications.map(app => app.id));
		}
	}

	function toggleOne(id: number) {
		if (selectedIds.includes(id)) {
			onSelectionChange?.(selectedIds.filter(i => i !== id));
		} else {
			onSelectionChange?.([...selectedIds, id]);
		}
	}

	function handleSort(field: string) {
		const url = new URL($page.url);
		const currentSort = url.searchParams.get('sort');
		const currentDir = url.searchParams.get('dir') || 'desc';

		if (currentSort === field) {
			url.searchParams.set('dir', currentDir === 'asc' ? 'desc' : 'asc');
		} else {
			url.searchParams.set('sort', field);
			url.searchParams.set('dir', 'desc');
		}
		url.searchParams.delete('page');
		goto(url.toString());
	}

	function getSortIndicator(field: string): string {
		if (sortField !== field) return '';
		return sortDirection === 'asc' ? ' ↑' : ' ↓';
	}
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			{#if onSelectionChange}
				<Table.Head class="w-[40px]">
					<input
						type="checkbox"
						checked={allSelected}
						onchange={toggleAll}
						class="rounded border-gray-300"
					/>
				</Table.Head>
			{/if}
			<Table.Head class="cursor-pointer hover:bg-gray-50" onclick={() => handleSort('startupName')}>
				Startup{getSortIndicator('startupName')}
			</Table.Head>
			<Table.Head class="cursor-pointer hover:bg-gray-50" onclick={() => handleSort('lastName')}>
				Founder{getSortIndicator('lastName')}
			</Table.Head>
			<Table.Head class="cursor-pointer hover:bg-gray-50" onclick={() => handleSort('industry')}>
				Industry{getSortIndicator('industry')}
			</Table.Head>
			<Table.Head class="cursor-pointer hover:bg-gray-50" onclick={() => handleSort('stage')}>
				Stage{getSortIndicator('stage')}
			</Table.Head>
			{#if showProgram}
				<Table.Head class="cursor-pointer hover:bg-gray-50" onclick={() => handleSort('programName')}>
					Program{getSortIndicator('programName')}
				</Table.Head>
			{/if}
			<Table.Head class="cursor-pointer hover:bg-gray-50" onclick={() => handleSort('createdAt')}>
				Applied{getSortIndicator('createdAt')}
			</Table.Head>
			<Table.Head class="cursor-pointer hover:bg-gray-50" onclick={() => handleSort('status')}>
				Status{getSortIndicator('status')}
			</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each applications as app}
			<Table.Row class={selectedIds.includes(app.id) ? 'bg-blue-50' : ''}>
				{#if onSelectionChange}
					<Table.Cell>
						<input
							type="checkbox"
							checked={selectedIds.includes(app.id)}
							onchange={() => toggleOne(app.id)}
							class="rounded border-gray-300"
						/>
					</Table.Cell>
				{/if}
				<Table.Cell class="font-medium">
					<a
						href="/applications/{app.id}{returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}"
						class="text-blue-600 hover:underline"
					>
						{app.startupName}
					</a>
				</Table.Cell>
				<Table.Cell>
					<div>{app.firstName} {app.lastName}</div>
					<button
						type="button"
						onclick={() => copyEmail(app.email)}
						class="group text-sm text-gray-500 flex items-center gap-1 rounded-full px-2 py-0.5 -ml-2 hover:bg-gray-100 transition-colors"
					>
						<span>{app.email}</span>
						<svg class="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
						</svg>
					</button>
				</Table.Cell>
				<Table.Cell>{INDUSTRY_LABELS[app.industry as keyof typeof INDUSTRY_LABELS] || app.industry}</Table.Cell>
				<Table.Cell>{STAGE_LABELS[app.stage as keyof typeof STAGE_LABELS] || app.stage}</Table.Cell>
				{#if showProgram}
					<Table.Cell>{app.programName}</Table.Cell>
				{/if}
				<Table.Cell>{formatDate(app.createdAt)}</Table.Cell>
				<Table.Cell>
					<StatusDropdown applicationId={app.id} currentStatus={app.status} />
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

{#if applications.length === 0}
	<div class="text-center py-8 text-gray-500">No applications found.</div>
{/if}
