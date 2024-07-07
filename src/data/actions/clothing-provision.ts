'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '../../lib/db.server';

const createClothingProvisionSchema = z.object({
	clothing: z.string(),
	day: z.date(),
});

export async function createClothingProvision(tripId: string, data: unknown) {
	const { clothing, day } = createClothingProvisionSchema.parse(data);

	await prisma.clothingProvision.create({
		data: {
			trip: { connect: { id: tripId } },
			clothing: { connect: { id: clothing } },
			day,
		},
	});

	revalidatePath('/dashboard/trips');
	return {
		type: 'success',
		message: 'Clothing provision successfully added',
	};
}

export async function deleteClothingProvision(provisionId: string) {
	await prisma.clothingProvision.delete({ where: { id: provisionId } });
	revalidatePath('/dashboard/trips');
	return {
		type: 'success',
		message: 'Clothing provision successfully removed',
	};
}
