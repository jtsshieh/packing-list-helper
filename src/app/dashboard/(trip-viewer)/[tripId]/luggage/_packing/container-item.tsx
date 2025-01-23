'use client';

import { useTransition } from 'react';

import { Checkbox } from '../../../../../../components/ui/checkbox';
import { Label } from '../../../../../../components/ui/label';
import { cn } from '../../../../../../lib/utils';
import { markContainerPacked } from './_data/actions';

export function ContainerPackItem({
	containerProvisionId,
	containerName,
	packed,
}: {
	containerProvisionId: string;
	containerName: string;
	packed: boolean;
}) {
	const [isLoading, startTransition] = useTransition();

	function handleOnChecked(checked: boolean) {
		startTransition(async () => {
			await markContainerPacked(containerProvisionId, {
				packed: checked,
			});
		});
	}

	return (
		<div
			className={cn(
				'z-50 flex items-center justify-between gap-2 rounded-lg p-1',
			)}
		>
			<Checkbox
				disabled={isLoading}
				checked={packed}
				onCheckedChange={handleOnChecked}
				id={containerProvisionId}
				className={cn(
					'my-1 h-6 w-6 rounded-lg',
					packed && 'color-neutral-500 border-neutral-500',
				)}
			/>
			<Label
				className={cn(
					'text-md flex-1 font-normal',
					packed && 'text-neutral-500 line-through',
				)}
				htmlFor={containerProvisionId}
			>
				{containerName}
			</Label>
		</div>
	);
}
