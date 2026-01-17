import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function add(message: string, type: ToastType = 'info') {
		const id = crypto.randomUUID();
		update(toasts => [...toasts, { id, message, type }]);

		// Auto-remove after 3 seconds
		setTimeout(() => {
			remove(id);
		}, 3000);
	}

	function remove(id: string) {
		update(toasts => toasts.filter(t => t.id !== id));
	}

	return {
		subscribe,
		success: (message: string) => add(message, 'success'),
		error: (message: string) => add(message, 'error'),
		info: (message: string) => add(message, 'info'),
		remove
	};
}

export const toast = createToastStore();
