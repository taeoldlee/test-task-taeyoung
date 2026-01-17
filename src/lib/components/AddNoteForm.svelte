<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';

	let authorName = $state('');
	let content = $state('');
</script>

<form
	method="POST"
	action="?/addNote"
	use:enhance={() => {
		return async ({ update, result }) => {
			if (result.type === 'success') {
				toast.success('Note added');
				authorName = '';
				content = '';
			} else {
				toast.error('Failed to add note');
			}
			await update();
		};
	}}
	class="space-y-4"
>
	<div>
		<label for="authorName" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
		<Input
			id="authorName"
			name="authorName"
			bind:value={authorName}
			placeholder="Enter your name"
			required
		/>
	</div>
	<div>
		<label for="content" class="block text-sm font-medium text-gray-700 mb-1">Note</label>
		<Textarea
			id="content"
			name="content"
			bind:value={content}
			placeholder="Add a note about this application..."
			rows={3}
			required
		/>
	</div>
	<Button type="submit">Add Note</Button>
</form>
