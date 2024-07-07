import { redirect } from 'next/navigation';
import { cache } from 'react';

import { prisma } from '../../lib/db.server';
import { getCurrentUser } from './user';

export const getAllEssentials = cache(async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser) redirect('/sign-in');

	return prisma.essential.findMany({
		orderBy: { name: 'asc' },
		where: {
			userId: currentUser.id,
		},
	});
});
