import { cache } from 'react';

import { prisma } from '@/lib/db.server';

import { getCurrentUserSafe } from '../../../(main)/account/_data/fetchers';

export const getAllTrips = cache(async () => {
	const currentUser = await getCurrentUserSafe();

	return prisma.trip.findMany({
		orderBy: { start: 'asc' },
		where: {
			userId: currentUser.id,
		},
	});
});

export const getTrip = cache(async (tripId: string) => {
	const currentUser = await getCurrentUserSafe();

	return prisma.trip.findUnique({
		where: {
			id: tripId,
			userId: currentUser.id,
		},
	});
});

export const getFullTrip = cache(async (tripId: string) => {
	const currentUser = await getCurrentUserSafe();

	return prisma.trip.findUnique({
		where: { id: tripId, userId: currentUser.id },
		include: {
			clothingProvisions: {
				include: {
					clothing: true,
					containerProvision: {
						include: {
							container: true,
							luggageProvision: { include: { luggage: true } },
						},
					},
				},
			},
			essentialProvisions: {
				include: {
					essential: true,
					containerProvision: {
						include: {
							container: true,
							luggageProvision: { include: { luggage: true } },
						},
					},
				},
			},
			containerProvisions: {
				include: {
					container: true,
					luggageProvision: { include: { luggage: true } },

					essentialProvisions: { include: { essential: true } },
					clothingProvisions: { include: { clothing: true } },
				},
			},
			luggageProvisions: {
				include: {
					luggage: true,

					containerProvisions: {
						include: {
							container: true,
							essentialProvisions: { include: { essential: true } },
							clothingProvisions: { include: { clothing: true } },
						},
					},
				},
			},
		},
	});
});
