import { cache } from 'react';

import { getCurrentUserSafe } from '../../../../../(main)/account/_data/fetchers';
import { prisma } from '../../../../../../../lib/db.server';

export const getTripWithLuggagePacked = cache(async (tripId: string) => {
	const currentUser = await getCurrentUserSafe();

	return prisma.trip.findUnique({
		where: { id: tripId, userId: currentUser.id },
		include: {
			luggageProvisions: {
				orderBy: { luggage: { order: 'asc' } },
				include: {
					containerProvisions: {
						include: {
							clothingProvisions: true,
							essentialProvisions: true,
							container: true,
						},
					},
					luggage: true,
				},
			},
			containerProvisions: {
				orderBy: { container: { order: 'asc' } },
				include: { container: true },
			},
		},
	});
});
