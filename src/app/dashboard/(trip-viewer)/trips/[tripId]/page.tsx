import { notFound } from 'next/navigation';

import { getTrip } from '../../../../../data/fetchers/trip';

export default async function TripPage({
	params,
}: {
	params: { tripId: string };
}) {
	const trip = await getTrip(params.tripId);
	if (!trip) return notFound();

	return (
		<>
			<h2 className="text-2xl font-bold">Welcome to your trip planner!</h2>
			<p className="text-base text-neutral-700">
				Use the mode selector in the top right corner to switch between the
				different modes.
			</p>
		</>
	);
}
