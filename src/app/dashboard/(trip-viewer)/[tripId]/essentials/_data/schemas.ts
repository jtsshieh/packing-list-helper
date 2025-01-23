import { z } from 'zod';

export const createEssentialProvisionSchema = z.object({
	id: z.string(),
});
