import { z } from 'zod';

export const createContainerProvisionSchema = z.object({
	containerId: z.string(),
});

export const addClothingProvisionToContainerSchema = z.object({
	clothingProvisionId: z.string(),
});

export const addEssentialProvisionToContainerSchema = z.object({
	essentialProvisionId: z.string(),
});
