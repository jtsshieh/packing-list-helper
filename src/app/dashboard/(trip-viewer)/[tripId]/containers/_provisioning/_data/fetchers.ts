import { cache } from 'react';

import { getCurrentUserSafe } from '../../../../../(main)/account/_data/fetchers';
import { prisma } from '../../../../../../../lib/db.server';

export const getTripWithContainerProvisions = cache(async (tripId: string) => {
	const currentUser = await getCurrentUserSafe();

	return prisma.trip.findUnique({
		where: { id: tripId, userId: currentUser.id },
		include: {
			clothingProvisions: {
				include: { clothing: true },
				orderBy: { day: 'asc' },
			},
			essentialProvisions: { include: { essential: true } },
			containerProvisions: {
				orderBy: { container: { order: 'asc' } },
				include: {
					clothingProvisions: {
						include: { clothing: true },
						orderBy: { containerOrder: 'asc' },
					},
					essentialProvisions: {
						include: { essential: true },
						orderBy: { containerOrder: 'asc' },
					},
					container: true,
				},
			},
		},
	});
});
