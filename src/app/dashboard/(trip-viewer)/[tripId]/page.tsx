import { notFound } from 'next/navigation';

import { getTrip } from './_data/fetchers';

export default async function TripPage({
	params,
}: {
	params: { tripId: string };
}) {
	const trip = await getTrip(params.tripId);
	if (!trip) return notFound();

	return (
		<>
			<h2 className="text-2xl font-bold">
				Welcome to the provisioning dashboard in the packing list trip planner!
			</h2>
			<p className="text-base text-neutral-700">
				Here's a brief overview of all the important information.
			</p>
		</>
	);
}
