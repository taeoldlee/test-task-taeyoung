<script lang="ts">
	import { toast, type Toast } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';

	let toasts: Toast[] = $state([]);

	toast.subscribe(value => {
		toasts = value;
	});

	const typeStyles = {
		success: 'bg-green-500 text-white',
		error: 'bg-red-500 text-white',
		info: 'bg-blue-500 text-white'
	};

	const typeIcons = {
		success: '✓',
		error: '✕',
		info: 'ℹ'
	};
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
	{#each toasts as t (t.id)}
		<div
			transition:fly={{ x: 100, duration: 200 }}
			class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] {typeStyles[t.type]}"
		>
			<span class="text-lg font-bold">{typeIcons[t.type]}</span>
			<span class="flex-1 text-sm font-medium">{t.message}</span>
			<button
				onclick={() => toast.remove(t.id)}
				class="opacity-70 hover:opacity-100 text-lg font-bold"
			>
				×
			</button>
		</div>
	{/each}
</div>
