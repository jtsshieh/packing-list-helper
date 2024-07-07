import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { getAllBrands } from '../../../../../data/fetchers/brand';
import { BrandsList } from './brands-list';
import { CreateBrandDialog } from './create-brand-dialog';

export default async function Brands() {
	const brands = await getAllBrands();

	return (
		<div className="h-svh w-screen p-8">
			<Button size="icon" variant="ghost" className="mb-4" asChild>
				<Link href="/public">
					<ChevronLeft />
				</Link>
			</Button>
			<div className="flex justify-between">
				<div>
					<h1 className="text-3xl">Brands</h1>
					<h2 className="mb-4 text-base text-neutral-600">
						These are the brands currently registered to the system.
					</h2>
				</div>
				<CreateBrandDialog />
			</div>
			<BrandsList brands={brands} />
		</div>
	);
}
