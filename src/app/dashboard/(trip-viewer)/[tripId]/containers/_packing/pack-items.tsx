'use client';

import { useTransition } from 'react';

import { Checkbox } from '../../../../../../components/ui/checkbox';
import { Label } from '../../../../../../components/ui/label';
import { cn } from '../../../../../../lib/utils';
import {
	markClothingProvisionPacked,
	markEssentialProvisionPacked,
} from './_data/actions';

export function ClothingPackItem({
	clothingProvisionId,
	clothingName,
	packed,
}: {
	clothingProvisionId: string;
	clothingName: string;
	packed: boolean;
}) {
	const [isLoading, startTransition] = useTransition();

	function handleOnChecked(checked: boolean) {
		startTransition(async () => {
			await markClothingProvisionPacked(clothingProvisionId, {
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
				id={clothingProvisionId}
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
				htmlFor={clothingProvisionId}
			>
				{clothingName}
			</Label>
		</div>
	);
}

export function EssentialPackItem({
	essentialProvisionId,
	essentialName,
	packed,
}: {
	essentialProvisionId: string;
	essentialName: string;
	packed: boolean;
}) {
	const [isLoading, startTransition] = useTransition();

	function handleOnChecked(checked: boolean) {
		startTransition(async () => {
			await markEssentialProvisionPacked(essentialProvisionId, {
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
				id={essentialProvisionId}
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
				htmlFor={essentialProvisionId}
			>
				{essentialName}
			</Label>
		</div>
	);
}
