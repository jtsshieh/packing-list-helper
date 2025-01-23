'use client';

import { TrashIcon } from 'lucide-react';
import React, { useTransition } from 'react';

import { Button } from '../../../../../components/ui/button';
import { deleteClothingProvision } from './_data/actions';

export function ClothingProvisionDelete({
	provisionId,
}: {
	provisionId: string;
}) {
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
			loading={isPending}
		>
			{!isPending && <TrashIcon size={16} />}
		</Button>
	);
}
