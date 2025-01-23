import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function filterUndefined<T>(arr: T[]) {
	return arr.filter((a) => a !== undefined);
}
