import { PropsWithChildren } from 'react';

import { PackingGearNav } from './packing-gear-nav';

export default function PackingGearLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex w-full flex-1 justify-center">
			<div className="flex w-full max-w-screen-2xl flex-1 flex-col">
				<div className="mb-4 flex items-center justify-between border-b pb-4">
					<div>
						<h1 className="text-3xl font-bold">Packing Gear</h1>
					</div>
					<PackingGearNav />
				</div>
				{children}
			</div>
		</div>
	);
}
