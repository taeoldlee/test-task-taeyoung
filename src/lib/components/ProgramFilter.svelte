<script lang="ts">
	import { Select } from '$lib/components/ui/select';
	import { goto } from '$app/navigation';
	import { buildQueryString } from '$lib/utils';
	import type { Program } from '$lib/server/db/types';

	interface Props {
		programs: Program[];
		selectedProgramId: number | null;
		currentStatus: string | null;
	}

	let { programs, selectedProgramId, currentStatus }: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const value = target.value;

		const params: Record<string, string | number | null> = {
			status: currentStatus,
			page: null
		};

		if (value && value !== 'all') {
			params.programId = parseInt(value);
		}

		goto(`/applications${buildQueryString(params)}`);
	}
</script>

<Select value={selectedProgramId?.toString() ?? 'all'} onchange={handleChange} class="w-[280px]">
	<option value="all">All Programs</option>
	{#each programs as program}
		<option value={program.id.toString()}>
			{program.name} {program.isActive ? '' : '(Inactive)'}
		</option>
	{/each}
</Select>
