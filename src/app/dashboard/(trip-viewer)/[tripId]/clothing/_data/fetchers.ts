import { cache } from 'react';

import { prisma } from '@/lib/db.server';

import { getCurrentUserSafe } from '../../../../(main)/account/_data/fetchers';

export const getTripWithClothingProvisions = cache(async (tripId: string) => {
	const currentUser = await getCurrentUserSafe();

	return prisma.trip.findUnique({
		where: {
			id: tripId,
			userId: currentUser.id,
		},
		include: {
			clothingProvisions: {
				include: { clothing: { include: { type: true } } },
				orderBy: { day: 'asc' },
			},
		},
	});
});
