'use server';

import { TripMode } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { prisma } from '../../lib/db.server';
import { FormResult } from '../../lib/types/form';
import { getCurrentUser } from '../fetchers/user';

const createTripSchema = z.object({
	name: z.string(),
	date: z.object({ from: z.date(), to: z.date() }),
});

export async function createTrip(
	pervState: FormResult | null,
	data: unknown,
): Promise<FormResult> {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const { name, date } = createTripSchema.parse(data);

	await prisma.trip.create({
		data: {
			name,
			start: date.from,
			end: date.to,
			user: { connect: { id: user.id } },
		},
	});

	revalidatePath('/dashboard/trips');
	return {
		type: 'success',
		message: 'Trip successfully added',
	};
}

const editTripSchema = zfd.formData({
	name: z.string().optional(),
	date: z.object({ from: z.date().optional(), to: z.date().optional() }),
});

export async function editTrip(
	tripId: string,
	prevState: FormResult | null,
	data: unknown,
): Promise<FormResult> {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const trip = await prisma.trip.findUnique({ where: { id: tripId } });
	if (trip?.userId !== user.id) throw new Error('Unauthorized');

	const { name, date } = editTripSchema.parse(data);
	await prisma.trip.update({
		where: {
			id: tripId,
		},
		data: { name, start: date.from, end: date.to },
	});

	revalidatePath('/dashboard/trips');
	return {
		type: 'success',
		message: 'Trip successfully edited',
	};
}

export async function deleteTrip(tripId: string) {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const trip = await prisma.trip.findUnique({ where: { id: tripId } });
	if (trip?.userId !== user.id) throw new Error('Unauthorized');

	await prisma.trip.delete({
		where: {
			id: tripId,
		},
	});

	revalidatePath('/dashboard/trips');
	return {
		type: 'success',
		message: 'Trip successfully deleted',
	};
}

const changeTripModeSchema = z.object({
	mode: z.enum([TripMode.Provision, TripMode.Pack, TripMode.Audit]),
});

export async function changeTripMode(tripId: string, data: unknown) {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const trip = await prisma.trip.findUnique({ where: { id: tripId } });
	if (trip?.userId !== user.id) throw new Error('Unauthorized');

	const { mode } = changeTripModeSchema.parse(data);
	await prisma.trip.update({
		where: {
			id: tripId,
		},
		data: { mode },
	});

	revalidatePath('/dashboard/trips');
	return {
		type: 'success',
		message: 'Trip mode successfully changed',
	};
}
