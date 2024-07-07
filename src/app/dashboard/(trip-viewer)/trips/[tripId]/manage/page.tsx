import { notFound } from 'next/navigation';

import { getTrip } from '../../../../../../data/fetchers/trip';
import { ManageTrip } from './manage-trip';

export default async function ManageTripPage({
	params,
}: {
	params: { tripId: string };
}) {
	const trip = await getTrip(params.tripId);
	if (!trip) return notFound();

	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex flex-col">
					<h2 className="text-2xl font-bold">Manage Trip</h2>
					<p className="text-base text-neutral-600">
						Edit details about this trip or delete this trip here.
					</p>
				</div>
			</div>
			<ManageTrip trip={trip} />
		</>
	);
}
