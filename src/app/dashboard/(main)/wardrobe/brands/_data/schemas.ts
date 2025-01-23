import { z } from 'zod';

export const createBrandSchema = z.object({
	name: z.string(),
});

export const editBrandSchema = z.object({
	name: z.string().optional(),
});
