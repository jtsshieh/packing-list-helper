'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '../../lib/db.server';

const createEssentialProvisionSchema = z.object({
	id: z.string(),
});

export async function createEssentialProvision(tripId: string, data: unknown) {
	const { id } = createEssentialProvisionSchema.parse(data);

	await prisma.essentialProvision.create({
		data: {
			trip: { connect: { id: tripId } },
			essential: { connect: { id } },
		},
	});

	revalidatePath('/dashboard/trips');
	return {
		type: 'success',
		message: 'Essential provision successfully added',
	};
}

export async function deleteEssentialProvision(provisionId: string) {
	await prisma.essentialProvision.delete({ where: { id: provisionId } });
	revalidatePath('/dashboard/trips');
	return {
		type: 'success',
		message: 'Essential provision successfully removed',
	};
}
