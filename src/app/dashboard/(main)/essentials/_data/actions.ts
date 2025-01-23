'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { authenticatedActionClient } from '../../../../../lib/action-client';
import { prisma } from '../../../../../lib/db.server';
import { createEssentialSchema, editEssentialSchema } from './schemas';

export const createEssential = authenticatedActionClient
	.metadata({ actionName: 'createEssential' })
	.schema(createEssentialSchema)
	.action(async ({ parsedInput: { name, category }, ctx: { user } }) => {
		await prisma.essential.create({
			data: {
				name,
				category,
				user: { connect: { id: user.id } },
			},
		});

		revalidateTag(`${user.id}-essentials`);

		return {
			type: 'success',
			message: 'Essential successfully added',
		};
	});

const mutateEssentialArgsSchema = z.tuple([z.string()]);

const essentialClient = authenticatedActionClient.use(
	async ({ next, bindArgsClientInputs, ctx: { user } }) => {
		const [essentialId] = mutateEssentialArgsSchema.parse(bindArgsClientInputs);

		const essential = await prisma.essential.findUnique({
			where: { id: essentialId },
		});
		if (essential?.userId !== user.id) throw new Error('Unauthorized');

		return next({ ctx: { essential, user } });
	},
);

export const editEssential = essentialClient
	.metadata({ actionName: 'editEssential' })
	.schema(editEssentialSchema)
	.bindArgsSchemas<[essentialId: z.ZodString]>([z.string()])
	.action(
		async ({ parsedInput: { name, category }, ctx: { essential, user } }) => {
			await prisma.essential.update({
				where: {
					id: essential.id,
				},
				data: {
					name,
					category,
				},
			});

			revalidateTag(`${user.id}-essentials`);

			return {
				type: 'success',
				message: 'Essential successfully edited',
			};
		},
	);

export const deleteEssential = essentialClient
	.metadata({ actionName: 'deleteEssential' })
	.bindArgsSchemas<[essentialId: z.ZodString]>([z.string()])
	.action(async ({ ctx: { essential, user } }) => {
		await prisma.essential.delete({
			where: {
				id: essential.id,
			},
		});

		revalidateTag(`${user.id}-essentials`);

		return {
			type: 'success',
			message: 'Essential successfully deleted',
		};
	});
