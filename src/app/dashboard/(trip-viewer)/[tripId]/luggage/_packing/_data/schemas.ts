import { z } from 'zod';

export const markContainerPackedSchema = z.object({
	packed: z.boolean(),
});
