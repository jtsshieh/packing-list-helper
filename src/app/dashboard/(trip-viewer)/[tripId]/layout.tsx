import { LoaderCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import React, { ReactNode, Suspense } from 'react';

import { getTrip } from './_data/fetchers';
import { MobileTripNav, TripSideNav } from './trip-nav';

async function TripViewerLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: { tripId: string };
}) {
	const trip = await getTrip(params.tripId);
	if (!trip) return notFound();

	return (
		<div className="flex h-svh w-screen flex-col">
			<div className="flex min-h-0 flex-1 flex-col md:flex-row">
				<div className="hidden md:block">
					<TripSideNav trip={trip} />
				</div>
				<div className="w-full border-b p-2 px-4 md:hidden">
					<MobileTripNav trip={trip} />
				</div>
				<div className="flex min-h-0 flex-1 scroll-pt-20 flex-col overflow-y-auto scroll-smooth bg-neutral-50 p-8">
					{children}
				</div>
			</div>
		</div>
	);
}

function TripViewerLoading() {
	return (
		<div className="flex h-svh w-screen items-center justify-center">
			<LoaderCircle className="h-8 w-8 animate-spin" />
		</div>
	);
}

export default function TripViewerLayoutSuspended(props: {
	children: ReactNode;
	params: { tripId: string };
}) {
	return (
		<Suspense fallback={<TripViewerLoading />}>
			<TripViewerLayout {...props} />
		</Suspense>
	);
}
