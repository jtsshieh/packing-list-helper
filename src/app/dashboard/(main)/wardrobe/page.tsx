import { getAllBrands } from '../../../../data/fetchers/brand';
import { getAllClothingTypesWithClothes } from '../../../../data/fetchers/clothing-type';
import { CreateClothingDialog } from './create-clothing-dialog';
import { WardrobeList } from './wardrobe-list';

export default async function WardrobePage() {
	const brands = await getAllBrands();
	const types = await getAllClothingTypesWithClothes();

	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Wardrobe</h1>
					<h2 className="text-base text-neutral-600">
						These are the pieces of clothing currently registered to the system.
					</h2>
				</div>
				<CreateClothingDialog brands={brands} types={types} />
			</div>
			<WardrobeList brands={brands} types={types} />
		</>
	);
}
