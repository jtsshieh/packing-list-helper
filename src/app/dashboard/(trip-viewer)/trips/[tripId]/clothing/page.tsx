import { Clothing, ClothingCategory, ClothingProvision } from '@prisma/client';
import { eachDayOfInterval } from 'date-fns';
import { notFound } from 'next/navigation';

import { getAllClothes } from '../../../../../../data/fetchers/clothing';
import { getAllClothingTypes } from '../../../../../../data/fetchers/clothing-type';
import { getTripWithClothingProvisions } from '../../../../../../data/fetchers/trip';
import { ClothingProvisionList } from './clothing-provision-list';
import { CreateClothingProvisionDialog } from './create-clothing-provision-dialog';

export default async function ClothingProvisionsPage({
	params,
}: {
	params: { tripId: string };
}) {
	const trip = await getTripWithClothingProvisions(params.tripId);

	if (!trip) return notFound();

	const clothes = await getAllClothes();
	const types = await getAllClothingTypes();
	const usedClothes = trip.clothingProvisions.map(
		(provision) => provision.clothing.id,
	);

	const groups: Record<
		string,
		Record<ClothingCategory, (ClothingProvision & { clothing: Clothing })[]>
	> = {};

	for (const day of eachDayOfInterval({ start: trip.start, end: trip.end })) {
		groups[day.toISOString()] = {
			[ClothingCategory.Top]: [],
			[ClothingCategory.Bottom]: [],
			[ClothingCategory.Accessory]: [],
		};
	}

	trip.clothingProvisions.forEach((provision) => {
		groups[provision.day.toISOString()][provision.clothing.type.category].push(
			provision,
		);
	});

	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex flex-col">
					<h2 className="text-2xl font-bold">Clothing Provisions</h2>
					<p className="text-base text-neutral-600">
						Provision clothes from your wardrobe to each day of your trip.
					</p>
				</div>
				<CreateClothingProvisionDialog
					clothes={clothes}
					usedClothes={usedClothes}
					trip={trip}
					types={types}
				/>
			</div>
			<ClothingProvisionList groups={groups} />
		</>
	);
}
