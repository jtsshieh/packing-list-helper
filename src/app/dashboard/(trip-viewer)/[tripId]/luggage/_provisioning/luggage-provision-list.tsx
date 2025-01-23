import React from 'react';

import { EmptyList } from '../../../../../../components/empty-list';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../../../../../../components/ui/card';
import { cn } from '../../../../../../lib/utils';
import { getTripWithLuggageProvisions } from './_data/fetchers';
import {
	AddContainerToLuggageDialog,
	DeleteContainerFromLuggageDialog,
	DeleteLuggageProvisionDialog,
} from './luggage-provision-dialogs';

interface LuggageProvisionListProps {
	trip: NonNullable<Awaited<ReturnType<typeof getTripWithLuggageProvisions>>>;
}

export function LuggageProvisionList({ trip }: LuggageProvisionListProps) {
	const unusedContainerProvisions = trip.containerProvisions.filter(
		(a) =>
			!trip.luggageProvisions.some((b) =>
				b.containerProvisions.some((c) => a.id === c.id),
			),
	);

	if (trip.luggageProvisions.length === 0) {
		return (
			<EmptyList
				main="You have not added any luggage to this trip"
				sub="You can start assigning your containers as soon as you add a luggage."
			/>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			{trip.luggageProvisions.map((luggageProvision) => (
				<Card key={luggageProvision.id}>
					<CardHeader className="flex flex-row items-center gap-2 space-y-0">
						<div className="flex-1">
							<CardTitle>{luggageProvision.luggage.name}</CardTitle>
						</div>
						<AddContainerToLuggageDialog
							luggageProvision={luggageProvision}
							containerProvisions={unusedContainerProvisions}
						/>
						<DeleteLuggageProvisionDialog luggageProvision={luggageProvision} />
					</CardHeader>
					<CardContent className="flex flex-col">
						{luggageProvision.containerProvisions.map(
							({ id, container }, i) => (
								<div
									key={id}
									className={cn(
										'flex items-center justify-between gap-2 py-1',
										i !== luggageProvision.containerProvisions.length - 1 &&
											'border-b',
									)}
								>
									<p className="flex-1 text-sm">{container.name}</p>
									<DeleteContainerFromLuggageDialog
										luggageProvisionId={luggageProvision.id}
										containerProvisionId={id}
									/>
								</div>
							),
						)}
					</CardContent>
					<CardFooter className="justify-between">
						{/*<DeleteBrandDialog brand={brand} />*/}
						{/*<EditBrandDialog brand={brand} />*/}
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
