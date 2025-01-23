'use server';

import { hash } from 'argon2';
import { revalidatePath } from 'next/cache';

import { signInWithPassword } from '../../../../(auth)/_data/actions';
import { prisma } from '../../../../../lib/db.server';
import { getCurrentUser } from './fetchers';

export async function createUser(username: string, password: string) {
	const hasUsername =
		(await prisma.user.findUnique({ where: { username } })) !== null;
	if (hasUsername) return { success: false, message: 'USERNAME_TAKEN' };

	await prisma.user.create({
		data: {
			username: username,
			password: await hash(password),
		},
	});
	return await signInWithPassword(username, password);
}

export async function deleteUser() {
	const user = await getCurrentUser();
	if (!user) return { success: false };

	await prisma.user.delete({ where: { id: user.id } });
	return { success: true };
}

export async function changeUsername(newUsername: string) {
	const user = await getCurrentUser();
	if (!user) return { success: false };

	try {
		await prisma.user.update({
			where: { id: user.id },
			data: { username: newUsername },
		});
	} catch {
		return { success: false };
	}
	revalidatePath('/');
	return { success: true };
}
