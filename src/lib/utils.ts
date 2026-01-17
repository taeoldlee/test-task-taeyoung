import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ApplicationStatus } from '$lib/types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

export function formatDateTime(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	const dateStr = d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
	const timeStr = d.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
		timeZoneName: 'short'
	});
	return `${dateStr} at ${timeStr}`;
}

export function buildQueryString(params: Record<string, string | number | null | undefined>): string {
	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== null && value !== undefined && value !== '') {
			searchParams.set(key, String(value));
		}
	}
	const str = searchParams.toString();
	return str ? `?${str}` : '';
}

export const statusColors: Record<ApplicationStatus, string> = {
	new: 'bg-gray-100 text-gray-800',
	reviewed: 'bg-blue-100 text-blue-800',
	accepted: 'bg-green-100 text-green-800',
	rejected: 'bg-red-100 text-red-800'
};
