import { getAllEssentials } from '../../../../data/fetchers/essential';
import { CreateEssentialDialog } from './create-essential-dialog';
import { EssentialsList } from './essentials-list';

export default async function EssentialsPage() {
	const essentials = await getAllEssentials();

	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Essentials</h1>
					<h2 className="text-base text-neutral-600">
						These are all the essentials that are registered to the system.
					</h2>
				</div>
				<CreateEssentialDialog />
			</div>
			<EssentialsList essentials={essentials} />
		</>
	);
}
