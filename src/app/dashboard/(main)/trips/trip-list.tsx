'use client';

import { Trip } from '@prisma/client';
import { format } from 'date-fns';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface TripListProps {
	trips: Trip[];
}

export function TripList({ trips }: TripListProps) {
	return (
		<div className="flex flex-col gap-4">
			{trips.map((trip) => (
				<Card key={trip.id}>
					<CardHeader>
						<CardTitle>{trip.name}</CardTitle>
						<CardDescription>
							{format(trip.start, 'LLL dd, y')} -{' '}
							{format(trip.end, 'LLL dd, y')}
						</CardDescription>
					</CardHeader>
					<CardFooter className="justify-end">
						<Button asChild>
							<Link href={`/dashboard/trips/${trip.id}`}>Open</Link>
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
