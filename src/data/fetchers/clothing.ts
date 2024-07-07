import { redirect } from 'next/navigation';

import { prisma } from '../../lib/db.server';
import { getCurrentUser } from './user';

export async function getAllClothes() {
	const currentUser = await getCurrentUser();
	if (!currentUser) redirect('/sign-in');

	return prisma.clothing.findMany({
		where: { userId: currentUser.id },
	});
}
