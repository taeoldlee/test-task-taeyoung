<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/Toast.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>TRMNL4 Admin Panel</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center gap-8">
					<a href="/applications" class="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
						TRMNL4 Admin Panel
					</a>
					<nav class="flex gap-6">
						<a href="/search" class="text-sm font-medium text-gray-700 hover:text-gray-900">
							Search
						</a>
					</nav>
				</div>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{@render children()}
	</main>
</div>

<Toast />
