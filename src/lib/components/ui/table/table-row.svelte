<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLTableRowElement> {
		class?: string;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<tr
	class={cn(
		'border-b border-gray-200 transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</tr>
