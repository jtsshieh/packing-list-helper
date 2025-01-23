'use client';

import { Container } from '@prisma/client';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

import { Toggle } from '../../../../../components/ui/toggle';
import { CreateContainerDialog } from './container-dialogs';
import { ContainerList } from './container-list';

export function ContainerWrapper({ containers }: { containers: Container[] }) {
	const [sorting, setSorting] = useState(false);
	return (
		<>
			<div className="mb-4 flex items-center justify-between gap-4">
				<div>
					<p className="text-base text-neutral-600">
						Containers are smaller containers, like packing cubes or toiletry
						bags, that are packed in luggage.
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
					<CreateContainerDialog />
				</div>
			</div>
			<ContainerList containers={containers} sorting={sorting} />
		</>
	);
}
