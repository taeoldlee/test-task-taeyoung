<script lang="ts">
	import { Select } from '$lib/components/ui/select';
	import { APPLICATION_STATUSES, STATUS_LABELS, type ApplicationStatus } from '$lib/types';
	import { enhance } from '$app/forms';

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
		return async ({ update }) => {
			await update({ reset: false });
		};
	}}
	bind:this={formElement}
>
	<input type="hidden" name="id" value={applicationId} />
	<Select
		name="status"
		value={currentStatus}
		onchange={() => formElement?.requestSubmit()}
		class="w-[130px]"
	>
		{#each APPLICATION_STATUSES as status}
			<option value={status}>{STATUS_LABELS[status]}</option>
		{/each}
	</Select>
</form>
