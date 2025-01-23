import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { getCurrentUserSafe } from '../app/dashboard/(main)/account/_data/fetchers';

export const actionClient = createSafeActionClient({
	defineMetadataSchema() {
		return z.object({
			actionName: z.string(),
		});
	},
});

export const authenticatedActionClient = actionClient.use(async ({ next }) => {
	const user = await getCurrentUserSafe();
	return next({ ctx: { user } });
});
