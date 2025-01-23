import { z } from 'zod';

export const createLuggageProvisionSchema = z.object({
	luggageId: z.string(),
});
export const addContainerProvisionToLuggageSchema = z.object({
	containerProvisionId: z.string(),
});
