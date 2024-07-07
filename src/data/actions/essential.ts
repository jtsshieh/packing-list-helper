'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { prisma } from '../../lib/db.server';
import { FormResult } from '../../lib/types/form';
import { getCurrentUser } from '../fetchers/user';

const createEssentialSchema = zfd.formData({
	name: zfd.text(),
	category: zfd.text(z.enum(['Toiletry', 'Document', 'Electronic'])),
});
export async function createEssential(
	pervState: FormResult | null,
	formData: FormData,
): Promise<FormResult> {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const { name, category } = createEssentialSchema.parse(formData);
	await prisma.essential.create({
		data: {
			name,
			category,
			user: { connect: { id: user.id } },
		},
	});

	revalidatePath('/dashboard/essentials');
	return {
		type: 'success',
		message: 'Essential successfully added',
	};
}
const editEssentialSchema = zfd.formData({
	name: zfd.text(z.string().optional()),
	category: zfd.text(z.enum(['Toiletry', 'Document', 'Electronic']).optional()),
});

export async function editEssential(
	id: string,
	prevState: FormResult | null,
	formData: FormData,
): Promise<FormResult> {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const essentialPiece = await prisma.essential.findUnique({ where: { id } });
	if (essentialPiece?.userId !== user.id) throw new Error('Unauthorized');

	const { name, category } = editEssentialSchema.parse(formData);

	await prisma.essential.update({
		where: {
			id,
		},
		data: {
			name,
			category,
		},
	});

	revalidatePath('/dashboard/essentials');
	return {
		type: 'success',
		message: 'Essential successfully edited',
	};
}

export async function deleteEssential(
	id: string,
	prevState: FormResult | null,
	formData: FormData,
): Promise<FormResult> {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const essentialPiece = await prisma.essential.findUnique({ where: { id } });
	if (essentialPiece?.userId !== user.id) throw new Error('Unauthorized');

	await prisma.essential.delete({
		where: {
			id,
		},
	});

	revalidatePath('/dashboard/essentials');
	return {
		type: 'success',
		message: 'Essential successfully deleted',
	};
}
