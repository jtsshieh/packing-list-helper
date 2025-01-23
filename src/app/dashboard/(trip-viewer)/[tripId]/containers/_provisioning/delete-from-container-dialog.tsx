'use client';

import { TrashIcon } from 'lucide-react';
import React, { useTransition } from 'react';

import { Button } from '../../../../../../components/ui/button';
import {
	deleteClothingProvisionFromContainer,
	deleteEssentialProvisionFromContainer,
} from './_data/actions';

export function DeleteFromContainerClothing({
	containerProvisionId,
	clothingProvisionId,
}: {
	containerProvisionId: string;
	clothingProvisionId: string;
}) {
	const [isPending, startTransition] = useTransition();
	const onClick = () =>
		startTransition(async () => {
			await deleteClothingProvisionFromContainer(
				containerProvisionId,
				clothingProvisionId,
			);
		});
	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={onClick}
			className="h-8 w-8"
			loading={isPending}
		>
			{!isPending && <TrashIcon size={16} />}
		</Button>
	);
}

export function DeleteFromContainerEssential({
	containerProvisionId,
	essentialProvisionId,
}: {
	containerProvisionId: string;
	essentialProvisionId: string;
}) {
	const [isPending, startTransition] = useTransition();
	const onClick = () =>
		startTransition(async () => {
			await deleteEssentialProvisionFromContainer(
				containerProvisionId,
				essentialProvisionId,
			);
		});
	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={onClick}
			className="h-8 w-8"
			loading={isPending}
		>
			{!isPending && <TrashIcon size={16} />}
		</Button>
	);
}
