import { cache } from 'react';

import { getCurrentUserSafe } from '../../../../(main)/account/_data/fetchers';
import { prisma } from '../../../../../../lib/db.server';

export const getTripWithEssentialProvisions = cache(async (tripId: string) => {
	const currentUser = await getCurrentUserSafe();

	return prisma.trip.findUnique({
		where: {
			id: tripId,
			userId: currentUser.id,
		},
		include: {
			essentialProvisions: {
				include: { essential: true },
				orderBy: { order: 'asc' },
			},
		},
	});
});
