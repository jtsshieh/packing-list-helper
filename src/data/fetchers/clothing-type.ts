import { redirect } from 'next/navigation';
import { cache } from 'react';

import { prisma } from '../../lib/db.server';
import { getCurrentUser } from './user';

export const getAllClothingTypes = cache(async () => {
	return prisma.clothingType.findMany({ orderBy: { name: 'asc' } });
});

export const getAllClothingTypesWithClothes = cache(async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser) redirect('/sign-in');

	return prisma.clothingType.findMany({
		orderBy: { name: 'asc' },
		include: { clothes: { where: { userId: currentUser.id } } },
	});
});
