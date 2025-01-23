import { z } from 'zod';

export const createClothingProvisionSchema = z.object({
	clothing: z.string(),
	day: z.date(),
});
