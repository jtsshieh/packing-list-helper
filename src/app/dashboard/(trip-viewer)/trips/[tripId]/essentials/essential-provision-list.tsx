'use client';

import { File, HandSoap, Plug } from '@phosphor-icons/react';
import {
	Essential,
	EssentialCategory,
	EssentialProvision,
} from '@prisma/client';
import { LoaderCircle, TrashIcon } from 'lucide-react';
import React, { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteEssentialProvision } from '@/data/actions/essential-provision';

const essentialCategories = [
	{
		category: EssentialCategory.Toiletry,
		icon: <HandSoap />,
		name: 'Toiletries',
	},
	{ category: EssentialCategory.Document, icon: <File />, name: 'Documents' },
	{
		category: EssentialCategory.Electronic,
		icon: <Plug />,
		name: 'Electronics',
	},
];
export function EssentialProvisionList({
	groups,
}: {
	groups: Record<
		EssentialCategory,
		(EssentialProvision & { essential: Essential })[]
	>;
}) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{essentialCategories.map(({ category, icon, name }) => (
				<Card key={category}>
					<CardHeader>
						<CardTitle className="flex gap-2">
							{icon} {name}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{groups[category].map((provision) => (
							<div
								key={provision.id}
								className="flex items-center justify-between gap-2"
							>
								<p className="text-base">{provision.essential.name}</p>
								<EssentialProvisionDelete provisionId={provision.id} />
							</div>
						))}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
function EssentialProvisionDelete({ provisionId }: { provisionId: string }) {
	const [isPending, startTransition] = useTransition();
	const onClick = () =>
		startTransition(async () => {
			await deleteEssentialProvision(provisionId);
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
