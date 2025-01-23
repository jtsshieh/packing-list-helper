'use client';

import { Luggage } from '@prisma/client';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

import { Toggle } from '../../../../../components/ui/toggle';
import { CreateLuggageDialog } from './luggage-dialogs';
import { LuggageList } from './luggage-list';

export function LuggageWrapper({ luggage }: { luggage: Luggage[] }) {
	const [sorting, setSorting] = useState(false);

	return (
		<>
			<div className="mb-4 flex items-center justify-between gap-4">
				<div>
					<p className="text-base text-neutral-600">
						Luggage include any large bags that you bring on a trip like
						suitcases and backpacks.
					</p>
				</div>
				<div className="flex gap-2">
					<Toggle
						variant="outline"
						pressed={sorting}
						onPressedChange={(val) => setSorting(val)}
						className="border-neutral-300 hover:bg-neutral-200 data-[state=on]:bg-neutral-200"
					>
						<ArrowUpDown />
					</Toggle>
					<CreateLuggageDialog />
				</div>
			</div>
			<LuggageList luggage={luggage} sorting={sorting} />
		</>
	);
}
