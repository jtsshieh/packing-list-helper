import { Box } from 'lucide-react';
import { notFound } from 'next/navigation';
import React from 'react';

import { getAllContainers } from '../../../../(main)/packing-gear/containers/_data/fetchers';
import { Progress } from '../../../../../../components/ui/progress';
import { getTripWithContainerProvisions } from './_data/fetchers';
import { CreateContainerProvisionDialog } from './container-provision-dialogs';
import { ContainerProvisionList } from './container-provision-list';

export async function ProvisioningPage({ tripId }: { tripId: string }) {
	const trip = await getTripWithContainerProvisions(tripId);
	if (!trip) return notFound();

	const containers = await getAllContainers();

	const toPack =
		trip.clothingProvisions.length + trip.essentialProvisions.length;

	let duplicates = 0;
	const existing: string[] = [];

	for (const prov of trip.clothingProvisions) {
		if (existing.includes(prov.clothing.id)) {
			duplicates++;
		} else {
			existing.push(prov.clothing.id);
		}
	}

	const packed = trip.containerProvisions.reduce(
		(a, b) => a + b.essentialProvisions.length + b.clothingProvisions.length,
		0,
	);

	return (
		<>
			<div className="mb-4 flex items-center gap-4">
				<Box className="h-10 w-10" />
				<div className="flex-1">
					<h2 className="text-2xl font-bold">Container Provisions</h2>
					<p className="text-base text-neutral-600">
						Choose the containers you'll be bringing on this trip and organize
						all of the items you've provisioned into these containers.
					</p>
				</div>
				<CreateContainerProvisionDialog
					trip={trip}
					containers={containers.filter(
						(a) =>
							!trip.containerProvisions.some((b) => a.id === b.containerId),
					)}
				/>
			</div>
			<div className="mb-4">
				<Progress value={(packed / (toPack - duplicates)) * 100} />
				<p className="mt-2 text-neutral-600">
					<span className="font-bold">
						{packed} / {toPack - duplicates}
					</span>{' '}
					of provisions assigned to a container
				</p>
			</div>

			<ContainerProvisionList trip={trip} />
		</>
	);
}
