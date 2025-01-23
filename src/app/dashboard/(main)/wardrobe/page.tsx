import { getAllClothingTypesWithClothes } from './_data/fetchers';
import { getAllBrands } from './brands/_data/fetchers';
import { CreateClothingDialog } from './clothing-dialogs';
import { WardrobeList } from './wardrobe-list';

export default async function WardrobePage() {
	const brands = await getAllBrands();
	const types = await getAllClothingTypesWithClothes();

	return (
		<div className="flex w-full flex-1 justify-center">
			<div className="flex w-full max-w-screen-2xl flex-1 flex-col">
				<div className="mb-4 flex items-center justify-between gap-4 border-b pb-4">
					<div className="flex-1">
						<h1 className="text-3xl font-bold">Wardrobe</h1>
						<h2 className="text-base text-neutral-600">
							These are the pieces of clothing currently registered to the
							system.
						</h2>
					</div>
					<CreateClothingDialog brands={brands} types={types} />
				</div>
				<WardrobeList brands={brands} types={types} />
			</div>
		</div>
	);
}
