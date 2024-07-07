'use server';

import { revalidatePath } from 'next/cache';
import { zfd } from 'zod-form-data';

import { prisma } from '../../lib/db.server';
import { FormResult } from '../../lib/types/form';

const createBrandSchema = zfd.formData({
	name: zfd.text(),
});
export async function createBrand(
	pervState: FormResult | null,
	formData: FormData,
): Promise<FormResult> {
	const { name } = createBrandSchema.parse(formData);
	await prisma.brand.create({
		data: {
			name,
		},
	});

	revalidatePath('/dashboard/brands');
	return {
		type: 'success',
		message: 'Brand successfully added',
	};
}
const editBrandSchema = zfd.formData({
	name: zfd.text().optional(),
});

export async function editBrand(
	brandName: string,
	prevState: FormResult | null,
	formData: FormData,
): Promise<FormResult> {
	const { name } = editBrandSchema.parse(formData);

	await prisma.brand.update({
		where: {
			name: brandName,
		},
		data: {
			name,
		},
	});

	revalidatePath('/dashboard/brands');
	return {
		type: 'success',
		message: 'Brand successfully edited',
	};
}

export async function deleteBrand(
	brandName: string,
	prevState: FormResult | null,
	formData: FormData,
): Promise<FormResult> {
	await prisma.brand.delete({
		where: {
			name: brandName,
		},
	});

	revalidatePath('/dashboard/brands');
	return {
		type: 'success',
		message: 'Brand successfully deleted',
	};
}
