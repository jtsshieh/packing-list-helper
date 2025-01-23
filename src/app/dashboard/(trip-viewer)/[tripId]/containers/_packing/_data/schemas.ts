import { z } from 'zod';

export const markClothingProvisionPackedSchema = z.object({
	packed: z.boolean(),
});

export const markEssentialProvisionPackedSchema = z.object({
	packed: z.boolean(),
});
