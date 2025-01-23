import React from 'react';

import { EmptyList } from '../../../../../../components/empty-list';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../../../../components/ui/card';
import { getTripWithLuggagePacked } from './_data/fetchers';
import { ContainerPackItem } from './container-item';

interface LuggagePackListProps {
	trip: NonNullable<Awaited<ReturnType<typeof getTripWithLuggagePacked>>>;
}
export function LuggagePackList({ trip }: LuggagePackListProps) {
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
					</CardHeader>
					<CardContent className="flex flex-col">
						{luggageProvision.containerProvisions.map(
							({ id, container, packed }) => (
								<ContainerPackItem
									key={id}
									containerProvisionId={id}
									containerName={container.name}
									packed={packed}
								/>
							),
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
