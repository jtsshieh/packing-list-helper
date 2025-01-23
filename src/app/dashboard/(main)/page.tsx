import React, { Suspense } from 'react';

import { CreateTripDialog } from './trip-dialogs';
import { TripList, TripListLoading } from './trip-list';

export default async function TripsPage() {
	return (
		<div className="flex w-full flex-1 justify-center">
			<div className="flex w-full max-w-screen-lg flex-1 flex-col">
				<div className="mb-4 flex items-center justify-between gap-4 border-b pb-4">
					<div className="flex-1">
						<h1 className="text-3xl font-bold">Trips</h1>
						<h2 className="text-base text-neutral-600">
							These are the trips that you've created.
						</h2>
					</div>
					<CreateTripDialog />
				</div>
				<Suspense fallback={<TripListLoading />}>
					<TripList />
				</Suspense>
			</div>
		</div>
	);
}
