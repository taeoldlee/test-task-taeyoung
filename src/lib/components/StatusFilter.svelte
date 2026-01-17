<script lang="ts">
	import { Select } from '$lib/components/ui/select';
	import { goto } from '$app/navigation';
	import { buildQueryString } from '$lib/utils';
	import { APPLICATION_STATUSES, STATUS_LABELS } from '$lib/types';

	interface Props {
		selectedStatus: string | null;
		currentProgramId: number | null;
	}

	let { selectedStatus, currentProgramId }: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const value = target.value;

		const params: Record<string, string | number | null> = {
			programId: currentProgramId,
			page: null
		};

		if (value && value !== 'all') {
			params.status = value;
		}

		goto(`/applications${buildQueryString(params)}`);
	}
</script>

<Select value={selectedStatus ?? 'all'} onchange={handleChange} class="w-[150px]">
	<option value="all">All Statuses</option>
	{#each APPLICATION_STATUSES as status}
		<option value={status}>{STATUS_LABELS[status]}</option>
	{/each}
</Select>
