import { z } from 'zod';

export const createLuggageSchema = z.object({
	name: z.string(),
});
export const editLuggageSchema = z.object({
	name: z.string().optional(),
	order: z.string().optional(),
});
