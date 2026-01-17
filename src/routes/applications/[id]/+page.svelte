<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Select } from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import NotesList from '$lib/components/NotesList.svelte';
	import AddNoteForm from '$lib/components/AddNoteForm.svelte';
	import { enhance } from '$app/forms';
	import { formatDate } from '$lib/utils';
	import { toast } from '$lib/stores/toast';
	import {
		JOB_ROLE_LABELS,
		INDUSTRY_LABELS,
		BUSINESS_MODEL_LABELS,
		STAGE_LABELS,
		STATUS_LABELS
	} from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let selectedStatus = $state(data.application.status);
	let copied = $state(false);

	function copyLink() {
		const url = `${window.location.origin}/applications/${data.application.id}`;
		navigator.clipboard.writeText(url);
		copied = true;
		toast.success('Link copied to clipboard');
		setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>{data.application.startupName} | TRMNL4 Admin Panel</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<a href={data.returnUrl} class="text-blue-600 hover:underline text-sm">
			&larr; Back to Applications
		</a>
		<Button variant="outline" size="sm" onclick={copyLink}>
			{copied ? 'Copied!' : 'Copy Link'}
		</Button>
	</div>

	<Card.Root>
		<Card.Header>
			<div class="flex justify-between items-start">
				<div>
					<Card.Title>{data.application.startupName}</Card.Title>
					<Card.Description>
						Applied to {data.application.programName}
						{#if data.application.programPartner}
							(Partner: {data.application.programPartner})
						{/if}
					</Card.Description>
				</div>
				<StatusBadge status={data.application.status} />
			</div>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-4">
					<h3 class="font-semibold text-gray-900">Founder Information</h3>
					<dl class="space-y-2">
						<div>
							<dt class="text-sm text-gray-500">Name</dt>
							<dd class="text-gray-900">{data.application.firstName} {data.application.lastName}</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500">Email</dt>
							<dd>
								<a href="mailto:{data.application.email}" class="text-blue-600 hover:underline">
									{data.application.email}
								</a>
							</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500">Role</dt>
							<dd class="text-gray-900">{JOB_ROLE_LABELS[data.application.jobRole]}</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500">Country</dt>
							<dd class="text-gray-900">{data.application.country}</dd>
						</div>
					</dl>
				</div>

				<div class="space-y-4">
					<h3 class="font-semibold text-gray-900">Company Information</h3>
					<dl class="space-y-2">
						<div>
							<dt class="text-sm text-gray-500">Startup Name</dt>
							<dd class="text-gray-900">{data.application.startupName}</dd>
						</div>
						{#if data.application.websiteUrl}
							<div>
								<dt class="text-sm text-gray-500">Website</dt>
								<dd>
									<a href={data.application.websiteUrl} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
										{data.application.websiteUrl}
									</a>
								</dd>
							</div>
						{/if}
						<div>
							<dt class="text-sm text-gray-500">Industry</dt>
							<dd class="text-gray-900">{INDUSTRY_LABELS[data.application.industry]}</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500">Business Model</dt>
							<dd class="text-gray-900">{BUSINESS_MODEL_LABELS[data.application.businessModel]}</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500">Stage</dt>
							<dd class="text-gray-900">{STAGE_LABELS[data.application.stage]}</dd>
						</div>
					</dl>
				</div>
			</div>

			{#if data.application.productDescription}
				<div class="mt-6">
					<h3 class="font-semibold text-gray-900 mb-2">Product Description</h3>
					<p class="text-gray-700 whitespace-pre-wrap">{data.application.productDescription}</p>
				</div>
			{/if}

			<div class="mt-6 pt-6 border-t border-gray-200">
				<div class="flex items-center gap-2 text-sm text-gray-500">
					<span>Applied: {formatDate(data.application.createdAt)}</span>
					<span>|</span>
					<span>Updated: {formatDate(data.application.updatedAt)}</span>
				</div>
			</div>

			<form
				method="POST"
				action="?/updateStatus"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							toast.success(`Status changed to ${STATUS_LABELS[selectedStatus]}`);
							await update({ reset: false });
						} else {
							toast.error('Failed to update status');
						}
					};
				}}
				class="mt-6 pt-6 border-t border-gray-200"
			>
				<div class="flex items-center gap-4">
					<label for="status" class="text-sm font-medium text-gray-700">Update Status:</label>
					<Select id="status" name="status" bind:value={selectedStatus} class="w-[180px]">
						{#each data.statuses as status}
							<option value={status}>{STATUS_LABELS[status]}</option>
						{/each}
					</Select>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Notes</Card.Title>
			<Card.Description>Internal notes about this application</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="space-y-6">
				<NotesList notes={data.notes} />
				<div class="pt-6 border-t border-gray-200">
					<h4 class="font-medium text-gray-900 mb-4">Add a Note</h4>
					<AddNoteForm />
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
