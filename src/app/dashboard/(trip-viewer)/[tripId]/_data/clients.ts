import { z } from 'zod';

import { authenticatedActionClient } from '@/lib/action-client';
import { prisma } from '@/lib/db.server';

export const tripClient = authenticatedActionClient.use(
	async ({ next, bindArgsClientInputs, ctx: { user } }) => {
		const [tripIdUnparsed] = bindArgsClientInputs;

		const tripId = z.string().parse(tripIdUnparsed);

		const trip = await prisma.trip.findUnique({ where: { id: tripId } });
		if (trip?.userId !== user.id) throw new Error('Unauthorized');

		return next({ ctx: { user, trip } });
	},
);

export const clothingProvisionClient = authenticatedActionClient.use(
	async ({ next, bindArgsClientInputs, ctx: { user } }) => {
		const [clothingProvisionIdUnparsed] = bindArgsClientInputs;

		const clothingProvisionId = z.string().parse(clothingProvisionIdUnparsed);

		const clothingProvision = await prisma.clothingProvision.findUnique({
			where: { id: clothingProvisionId },
			include: { trip: true },
		});
		if (clothingProvision?.trip.userId !== user.id)
			throw new Error('Unauthorized');

		return next({ ctx: { user, clothingProvision } });
	},
);

export const essentialProvisionClient = authenticatedActionClient.use(
	async ({ next, bindArgsClientInputs, ctx: { user } }) => {
		const [essentialProvisionIdUnparsed] = bindArgsClientInputs;

		const essentialProvisionId = z.string().parse(essentialProvisionIdUnparsed);

		const essentialProvision = await prisma.essentialProvision.findUnique({
			where: { id: essentialProvisionId },
			include: { trip: true },
		});
		if (essentialProvision?.trip.userId !== user.id)
			throw new Error('Unauthorized');

		return next({ ctx: { user, essentialProvision } });
	},
);

export const containerProvisionClient = authenticatedActionClient.use(
	async ({ next, bindArgsClientInputs, ctx: { user } }) => {
		const [containerProvisionIdUnparsed] = bindArgsClientInputs;

		const containerProvisionId = z.string().parse(containerProvisionIdUnparsed);

		const containerProvision = await prisma.containerProvision.findUnique({
			where: { id: containerProvisionId },
			include: { trip: true },
		});
		if (containerProvision?.trip.userId !== user.id)
			throw new Error('Unauthorized');

		return next({ ctx: { user, containerProvision } });
	},
);
