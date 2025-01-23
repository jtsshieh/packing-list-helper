import { TripMode } from '@prisma/client';
import { notFound } from 'next/navigation';
import React from 'react';

import { getTrip } from '../_data/fetchers';
import { PackingPage } from './_packing/packing-page';
import { ProvisioningPage } from './_provisioning/provisioning-page';

export default async function LuggagePage({
	params,
}: {
	params: { tripId: string };
}) {
	const trip = await getTrip(params.tripId);
	if (!trip) return notFound();
	if (trip.mode === TripMode.Provision) {
		return <ProvisioningPage tripId={params.tripId} />;
	} else {
		return <PackingPage tripId={params.tripId} />;
	}
}
