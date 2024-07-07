import { format } from 'date-fns';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { ReactNode, Suspense } from 'react';

import { Button } from '@/components/ui/button';

import { getTrip } from '../../../../../data/fetchers/trip';
import { TripModeSelector, TripSideNav } from './trip-nav';

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
			<header className="flex items-center justify-between bg-neutral-800 px-4 py-4">
				<div className="flex items-center gap-2">
					<Button
						size="icon"
						variant="ghost"
						asChild
						className="hover:bg-neutral-700"
					>
						<Link href="/dashboard/trips">
							<ChevronLeft color="#ffffff" />
						</Link>
					</Button>
					<div className="flex flex-col">
						<h1 className="text-2xl font-bold text-neutral-50">{trip.name}</h1>
						<p className="text-sm text-neutral-200">
							{format(trip.start, 'LLL dd, y')} -{' '}
							{format(trip.end, 'LLL dd, y')}
						</p>
					</div>
				</div>
				<TripModeSelector tripId={params.tripId} tripMode={trip.mode} />
			</header>
			<div className="grid min-h-0 flex-1 grid-cols-[240px_1fr]">
				<TripSideNav tripId={params.tripId} tripMode={trip.mode} />
				<div className="min-h-0 overflow-y-scroll bg-neutral-50 p-8">
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
