import { z } from 'zod';

export const createClothingSchema = z.object({
	brandLine: z.string().optional(),
	color: z.string(),
	number: z.number().optional(),
	modifier: z.string().optional(),

	type: z.string(),
	brand: z.string(),
});

export const editClothingSchema = z.object({
	brandLine: z.string().optional(),
	color: z.string().optional(),
	number: z.number().optional(),
	modifier: z.string().optional(),

	type: z.string().optional(),
	brand: z.string().optional(),
});
