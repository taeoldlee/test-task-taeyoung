<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLThAttributes } from 'svelte/elements';

	interface Props extends HTMLThAttributes {
		class?: string;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<th
	class={cn(
		'h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</th>
