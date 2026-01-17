<script lang="ts">
	import { cn, statusColors } from '$lib/utils';
	import { APPLICATION_STATUSES, STATUS_LABELS, type ApplicationStatus } from '$lib/types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';

	interface Props {
		applicationId: number;
		currentStatus: ApplicationStatus;
	}

	let { applicationId, currentStatus }: Props = $props();
	let formElement: HTMLFormElement | undefined = $state();
</script>

<form
	method="POST"
	action="/applications?/updateStatus"
	use:enhance={() => {
		const newStatus = (formElement?.querySelector('select') as HTMLSelectElement)?.value;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.success(`Status changed to ${STATUS_LABELS[newStatus as ApplicationStatus]}`);
			} else {
				toast.error('Failed to update status');
			}
			await update({ reset: false });
		};
	}}
	bind:this={formElement}
>
	<input type="hidden" name="id" value={applicationId} />
	<div class="relative inline-block">
		<select
			name="status"
			value={currentStatus}
			onchange={() => formElement?.requestSubmit()}
			class={cn(
				'appearance-none cursor-pointer rounded-full pl-3 pr-7 py-1 text-xs font-semibold text-center',
				'border-0 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
				'hover:opacity-80 transition-opacity',
				statusColors[currentStatus]
			)}
		>
			{#each APPLICATION_STATUSES as status}
				<option value={status}>{STATUS_LABELS[status]}</option>
			{/each}
		</select>
		<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
			<svg class="h-3 w-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
			</svg>
		</div>
	</div>
</form>
