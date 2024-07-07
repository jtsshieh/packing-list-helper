'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { prisma } from '../../lib/db.server';
import { FormResult } from '../../lib/types/form';
import { getCurrentUser } from '../fetchers/user';

const createClothingSchema = zfd.formData({
	brandLine: zfd.text(z.string().optional()),
	color: zfd.text(),
	number: zfd.numeric(z.number().optional()),
	modifier: zfd.text(z.string().optional()),

	type: zfd.text(),
	brand: zfd.text(),
});
export async function createClothing(
	pervState: FormResult | null,
	formData: FormData,
): Promise<FormResult> {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const { brandLine, color, number, modifier, type, brand } =
		createClothingSchema.parse(formData);
	await prisma.clothing.create({
		data: {
			brandLine,
			color,
			number,
			modifier,
			user: { connect: { id: user.id } },

			type: {
				connect: {
					name: type,
				},
			},
			brand: {
				connect: {
					name: brand,
				},
			},
		},
	});

	revalidatePath('/dashboard/wardrobe');
	return {
		type: 'success',
		message: 'Clothing successfully added',
	};
}
const editClothingSchema = zfd.formData({
	brandLine: zfd.text(z.string().optional()),
	color: zfd.text(z.string().optional()),
	number: zfd.numeric(z.number().optional()),
	modifier: zfd.text(z.string().optional()),

	type: zfd.text(z.string().optional()),
	brand: zfd.text(z.string().optional()),
});

export async function editClothing(
	id: string,
	prevState: FormResult | null,
	formData: FormData,
): Promise<FormResult> {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const clothingPiece = await prisma.clothing.findUnique({ where: { id } });
	if (clothingPiece?.userId !== user.id) throw new Error('Unauthorized');

	const { brandLine, color, number, modifier, type, brand } =
		editClothingSchema.parse(formData);

	const payload = {
		brandLine,
		color,
		number,
		modifier,
	};

	if (type) {
		Object.assign(payload, { type: { connect: { name: type } } });
	}
	if (brand) {
		Object.assign(payload, { brand: { connect: { name: brand } } });
	}
	await prisma.clothing.update({
		where: {
			id,
		},
		data: payload,
	});

	revalidatePath('/dashboard/wardrobe');
	return {
		type: 'success',
		message: 'Brand successfully edited',
	};
}

export async function deleteClothing(
	id: string,
	prevState: FormResult | null,
	formData: FormData,
): Promise<FormResult> {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const clothingPiece = await prisma.clothing.findUnique({ where: { id } });
	if (clothingPiece?.userId !== user.id) throw new Error('Unauthorized');

	await prisma.clothing.delete({
		where: {
			id,
		},
	});

	revalidatePath('/dashboard/wardrobe');
	return {
		type: 'success',
		message: 'Clothing successfully deleted',
	};
}
