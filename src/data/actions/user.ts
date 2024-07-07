'use server';

import { hash, verify } from 'argon2';
import { SignJWT } from 'jose';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { prisma } from '../../lib/db.server';
import { getCurrentUser } from '../fetchers/user';

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
	return await signIn(username, password);
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

export async function signIn(username: string, password: string) {
	const user = await prisma.user.findUnique({ where: { username: username } });
	if (user && (await verify(user.password, password))) {
		const jwt = await new SignJWT({ sub: user.id })
			.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
			.setIssuedAt()
			.setExpirationTime('1 week')
			.sign(new TextEncoder().encode(process.env.JWT_SECRET!));

		cookies().set('auth', jwt, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
		});
		return {
			success: true,
		};
	} else {
		return {
			success: false,
		};
	}
}

export async function signOut() {
	cookies().delete('auth');
	revalidatePath('/dashboard');
	return { success: true };
}
