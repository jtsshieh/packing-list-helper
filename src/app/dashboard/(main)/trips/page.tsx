import React from 'react';

import { getAllTrips } from '../../../../data/fetchers/trip';
import { CreateTripDialog } from './trip-dialogs';
import { TripList } from './trip-list';

export default async function TripsPage() {
	const trips = await getAllTrips();
	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Trips</h1>
					<h2 className="text-base text-neutral-600">
						These are the trips that are currently registered to the system.
					</h2>
				</div>
				<CreateTripDialog />
			</div>
			<TripList trips={trips} />
		</>
	);
}
