import { cache } from 'react';

import { prisma } from '../../../../../../lib/db.server';
import { getCurrentUserSafe } from '../../../account/_data/fetchers';

export const getAllLuggage = cache(async () => {
	const currentUser = await getCurrentUserSafe();

	return prisma.luggage.findMany({
		where: {
			userId: currentUser.id,
		},
		orderBy: {
			order: 'asc',
		},
	});
});
