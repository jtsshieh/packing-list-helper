import {
	Essential,
	EssentialCategory,
	EssentialProvision,
} from '@prisma/client';
import { notFound } from 'next/navigation';

import { getAllEssentials } from '../../../../../../data/fetchers/essential';
import { getTripWithEssentialProvisions } from '../../../../../../data/fetchers/trip';
import { CreateEssentialProvisionDialog } from './create-essential-provision-dialog';
import { EssentialProvisionList } from './essential-provision-list';

export default async function EssentialProvisionsPage({
	params,
}: {
	params: { tripId: string };
}) {
	const trip = await getTripWithEssentialProvisions(params.tripId);

	if (!trip) return notFound();

	const essentials = await getAllEssentials();

	const groups: Record<
		EssentialCategory,
		(EssentialProvision & { essential: Essential })[]
	> = {
		[EssentialCategory.Toiletry]: [],
		[EssentialCategory.Document]: [],
		[EssentialCategory.Electronic]: [],
	};

	trip.essentialProvisions.forEach((provision) => {
		groups[provision.essential.category].push(provision);
	});

	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex flex-col">
					<h2 className="text-2xl font-bold">Essentials Provisions</h2>
					<p className="text-base text-neutral-600">
						Provision your essentials to bring on this trip.
					</p>
				</div>
				<CreateEssentialProvisionDialog trip={trip} essentials={essentials} />
			</div>
			<EssentialProvisionList groups={groups} />
		</>
	);
}
