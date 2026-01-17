<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'default' | 'secondary' | 'destructive' | 'outline';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: Variant;
		class?: string;
	}

	let { variant = 'default', class: className, children, ...restProps }: Props = $props();

	const variants: Record<Variant, string> = {
		default: 'bg-gray-900 text-white',
		secondary: 'bg-gray-100 text-gray-900',
		destructive: 'bg-red-500 text-white',
		outline: 'border border-gray-300 text-gray-900'
	};
</script>

<div
	class={cn(
		'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
		variants[variant],
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
