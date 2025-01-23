import { Box } from 'lucide-react';
import { notFound } from 'next/navigation';
import React from 'react';

import { Progress } from '../../../../../../components/ui/progress';
import { getTripWithLuggagePacked } from './_data/fetchers';
import { LuggagePackList } from './luggage-pack-list';

export async function PackingPage({ tripId }: { tripId: string }) {
	const trip = await getTripWithLuggagePacked(tripId);
	if (!trip) return notFound();

	const packed = trip.luggageProvisions.reduce((prev, luggageProvision) => {
		const isFull = luggageProvision.containerProvisions.every(
			(containerProvision) => containerProvision.packed,
		);

		return prev + (isFull ? 1 : 0);
	}, 0);

	const toPack = trip.luggageProvisions.length;

	return (
		<>
			<div className="mb-4 flex items-center gap-4">
				<Box className="h-10 w-10" />
				<div className="flex-1">
					<h2 className="text-2xl font-bold">Luggage Packed</h2>
					<p className="text-base text-neutral-600">
						Mark the containers you've packed and secured into your luggage.
					</p>
				</div>
			</div>
			<div className="mb-4">
				<Progress value={(packed / toPack) * 100} />
				<p className="mt-2 text-neutral-600">
					<span className="font-bold">
						{packed} / {toPack}
					</span>{' '}
					of luggage ready
				</p>
			</div>

			<LuggagePackList trip={trip} />
		</>
	);
}
