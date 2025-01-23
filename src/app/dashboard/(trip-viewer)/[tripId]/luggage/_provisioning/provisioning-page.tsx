import { Luggage } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { getAllLuggage } from '../../../../(main)/packing-gear/luggage/_data/fetchers';
import { Progress } from '../../../../../../components/ui/progress';
import { getTripWithLuggageProvisions } from './_data/fetchers';
import { CreateLuggageProvisionDialog } from './create-luggage-provision-dialog';
import { LuggageProvisionList } from './luggage-provision-list';

export async function ProvisioningPage({ tripId }: { tripId: string }) {
	const trip = await getTripWithLuggageProvisions(tripId);
	if (!trip) return notFound();

	const luggage = await getAllLuggage();

	const toAssign = trip.containerProvisions.length;
	const assigned = trip.luggageProvisions.reduce(
		(a, b) => a + b.containerProvisions.length,
		0,
	);

	return (
		<>
			<div className="mb-4 flex items-center gap-4">
				<Luggage className="h-10 w-10" />
				<div className="flex-1">
					<h2 className="text-2xl font-bold">Luggage</h2>
					<p className="text-base text-neutral-600">
						Choose all the luggage you'll be bringing on this trip and organize
						your{' '}
						<Link
							href={`/dashboard/${tripId}/containers`}
							className="font-medium text-neutral-700 hover:text-neutral-900"
						>
							selected containers
						</Link>{' '}
						into your selected luggage.
					</p>
				</div>
				<CreateLuggageProvisionDialog
					trip={trip}
					luggage={luggage.filter(
						(a) => !trip.luggageProvisions.some((b) => a.id === b.luggageId),
					)}
				/>
			</div>
			<div className="mb-4">
				<Progress value={(assigned / toAssign) * 100} />
				<p className="mt-2 text-neutral-600">
					<span className="font-bold">
						{assigned} / {toAssign}
					</span>{' '}
					of containers assigned to a luggage
				</p>
			</div>
			<LuggageProvisionList trip={trip} />
		</>
	);
}
