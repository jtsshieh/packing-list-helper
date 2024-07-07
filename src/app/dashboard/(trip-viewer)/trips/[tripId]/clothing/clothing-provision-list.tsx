'use client';

import { Pants, Sock, TShirt } from '@phosphor-icons/react';
import { Clothing, ClothingCategory, ClothingProvision } from '@prisma/client';
import { format } from 'date-fns';
import { LoaderCircle, TrashIcon } from 'lucide-react';
import React, { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { deleteClothingProvision } from '@/data/actions/clothing-provision';
import { generateClothingName } from '@/lib/generate-clothing-name';

const provisionCategories = [
	{ category: ClothingCategory.Top, icon: <TShirt />, name: 'Tops' },
	{ category: ClothingCategory.Bottom, icon: <Pants />, name: 'Bottoms' },
	{
		category: ClothingCategory.Accessory,
		icon: <Sock />,
		name: 'Accessories',
	},
];
export function ClothingProvisionList({
	groups,
}: {
	groups: Record<
		string,
		Record<ClothingCategory, (ClothingProvision & { clothing: Clothing })[]>
	>;
}) {
	return (
		<div className="flex flex-col gap-4">
			{Object.entries(groups).map(([day, provisions]) => {
				return (
					<Card key={day}>
						<CardHeader>
							<CardTitle>{format(day, 'LLL dd, y')}</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-3 gap-2">
							{provisionCategories.map(({ category, icon, name }) => (
								<div className="rounded-lg border p-4" key={category}>
									<p className="mb-2 flex items-center gap-2 text-lg font-bold">
										{icon} {name}
									</p>
									{provisions[category].map((provision) => (
										<div
											key={provision.id}
											className="flex items-center justify-between gap-2"
										>
											<p className="text-sm">
												{generateClothingName(provision.clothing)}
											</p>
											<ClothingProvisionDelete provisionId={provision.id} />
										</div>
									))}
								</div>
							))}
						</CardContent>
						<CardFooter className="justify-between">
							{/*<DeleteBrandDialog brand={brand} />*/}
							{/*<EditBrandDialog brand={brand} />*/}
						</CardFooter>
					</Card>
				);
			})}
		</div>
	);
}

function ClothingProvisionDelete({ provisionId }: { provisionId: string }) {
	const [isPending, startTransition] = useTransition();
	const onClick = () =>
		startTransition(async () => {
			await deleteClothingProvision(provisionId);
		});
	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={onClick}
			className="h-8 w-8"
			disabled={isPending}
		>
			{isPending ? (
				<LoaderCircle className="h-4 w-4 animate-spin" />
			) : (
				<TrashIcon size={16} />
			)}
		</Button>
	);
}
