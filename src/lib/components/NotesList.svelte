<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { formatDateTime } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';

	interface Note {
		id: number;
		authorName: string;
		content: string;
		createdAt: Date;
	}

	interface Props {
		notes: Note[];
	}

	let { notes }: Props = $props();
</script>

<div class="space-y-4">
	{#if notes.length === 0}
		<p class="text-gray-500 text-sm">No notes yet.</p>
	{:else}
		{#each notes as note}
			<div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
				<div class="flex justify-between items-start">
					<div>
						<div class="font-medium text-sm">{note.authorName}</div>
						<div class="text-xs text-gray-500">{formatDateTime(note.createdAt)}</div>
					</div>
					<form
						method="POST"
						action="?/deleteNote"
						use:enhance={() => {
							return async ({ result, update }) => {
								if (result.type === 'success') {
									toast.success('Note deleted');
									await update({ reset: false });
								} else {
									toast.error('Failed to delete note');
								}
							};
						}}
					>
						<input type="hidden" name="noteId" value={note.id} />
						<Button
							type="submit"
							variant="ghost"
							size="sm"
							class="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
						>
							Delete
						</Button>
					</form>
				</div>
				<p class="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
			</div>
		{/each}
	{/if}
</div>
