import { unstable_cache } from 'next/cache';

import { prisma } from '../../../../../lib/db.server';
import { getCurrentUserSafe } from '../../account/_data/fetchers';

export const getAllEssentials = async () => {
	const user = await getCurrentUserSafe();
	return unstable_cache(
		async () => {
			console.log(`revalidating data cache for ${user.id}`);
			return prisma.essential.findMany({
				orderBy: { name: 'asc' },
				where: {
					userId: user.id,
				},
			});
		},
		['essentials', user.id],
		{
			tags: [`${user.id}-essentials`],
		},
	)();
};
