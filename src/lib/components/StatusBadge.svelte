<script lang="ts">
	import { cn, statusColors } from '$lib/utils';
	import type { ApplicationStatus } from '$lib/types';

	interface Props {
		status: ApplicationStatus;
		class?: string;
	}

	let { status, class: className }: Props = $props();
</script>

<span
	class={cn(
		'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
		statusColors[status],
		className
	)}
>
	{status.charAt(0).toUpperCase() + status.slice(1)}
</span>
