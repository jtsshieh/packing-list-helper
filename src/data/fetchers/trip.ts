import { redirect } from 'next/navigation';
import { cache } from 'react';

import { prisma } from '../../lib/db.server';
import { getCurrentUser } from './user';

export const getAllTrips = cache(async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser) redirect('/sign-in');

	return prisma.trip.findMany({
		orderBy: { name: 'asc' },
		where: {
			userId: currentUser.id,
		},
	});
});
export const getTrip = cache(async (tripId: string) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) redirect('/sign-in');

	return prisma.trip.findUnique({
		where: {
			id: tripId,
			userId: currentUser.id,
		},
	});
});

export const getTripWithClothingProvisions = cache(async (tripId: string) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) redirect('/sign-in');

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

export const getTripWithEssentialProvisions = cache(async (tripId: string) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) redirect('/sign-in');

	return prisma.trip.findUnique({
		where: {
			id: tripId,
			userId: currentUser.id,
		},
		include: {
			essentialProvisions: {
				include: { essential: true },
			},
		},
	});
});
