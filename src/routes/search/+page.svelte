<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import ApplicationTable from '$lib/components/ApplicationTable.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let searchQuery = $state(data.query);
</script>

<svelte:head>
	<title>Search | TRMNL4 Admin Panel</title>
</svelte:head>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-gray-900">Search Applications</h1>

	<form method="GET" class="flex gap-3">
		<Input
			type="search"
			name="q"
			bind:value={searchQuery}
			placeholder="Search by startup name, founder name, email, or note content..."
			class="flex-1"
		/>
		<Button type="submit">Search</Button>
	</form>

	{#if data.query}
		<div class="text-sm text-gray-600">
			{#if data.pagination.totalCount > 0}
				Found {data.pagination.totalCount} result{data.pagination.totalCount === 1 ? '' : 's'} for "{data.query}"
			{:else}
				No results found for "{data.query}"
			{/if}
		</div>

		<div class="bg-white rounded-lg shadow">
			<ApplicationTable applications={data.applications} showProgram={true} />
			<Pagination
				{...data.pagination}
				baseUrl="/search"
				filters={{ q: data.query }}
			/>
		</div>
	{:else}
		<div class="text-center py-12 text-gray-500">
			<p>Enter a search term to find applications</p>
			<p class="text-sm mt-2">Search across startup names, founder names, emails, and note content</p>
		</div>
	{/if}
</div>
