import { z } from 'zod';

export const renamePasskeySchema = z.object({
	name: z.string(),
});
