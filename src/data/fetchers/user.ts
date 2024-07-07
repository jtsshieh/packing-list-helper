'use server';

import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { z } from 'zod';

import { prisma } from '../../lib/db.server';

export interface ClientUser {
	id: string;
	username: string;
}
const jwtSchema = z.object({
	sub: z.string(),
});
async function _getCurrentUser(): Promise<ClientUser | null> {
	const token = cookies().get('auth');
	if (!token) return null;

	let jwtUser;
	try {
		jwtUser = await jwtVerify(
			token.value,
			new TextEncoder().encode(process.env.JWT_SECRET!),
		);
	} catch {
		return null;
	}

	const parsed = jwtSchema.safeParse(jwtUser.payload);
	if (parsed.error) return null;

	const user = await prisma.user.findUnique({ where: { id: parsed.data.sub } });
	if (!user) return null;

	return { id: user.id, username: user.username };
}

export const getCurrentUser = cache(_getCurrentUser);
