'use client';

import { Brand, ClothingType } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { createClothing } from '@/data/actions/clothing';

import { colors } from './constants';

interface CreateClothingDialogProps {
	brands: Brand[];
	types: ClothingType[];
}
export function CreateClothingDialog({
	brands,
	types,
}: CreateClothingDialogProps) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(createClothing, null);
	useEffect(() => {
		if (state && state.type === 'success') {
			setOpen(false);
		}
	}, [state]);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="icon">
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent asChild>
				<form action={formAction}>
					<DialogHeader>
						<DialogTitle>Create clothing</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="type" className="text-right">
								Type
							</Label>
							<Select name="type">
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select the type of clothing" />
								</SelectTrigger>
								<SelectContent>
									{types.map((type) => (
										<SelectItem key={type.name} value={type.name}>
											{type.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="brand" className="text-right">
								Brand
							</Label>
							<Select name="brand">
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select the brand of clothing" />
								</SelectTrigger>
								<SelectContent className="col-span-3">
									{brands.map((brand) => (
										<SelectItem key={brand.name} value={brand.name}>
											{brand.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="brandLine" className="text-right">
								Brand Line
							</Label>
							<Input id="brand-line" name="brandLine" className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="color" className="text-right">
								Color
							</Label>
							<Select name="color">
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select the color of clothing" />
								</SelectTrigger>
								<SelectContent>
									{colors.map((color) => (
										<SelectItem key={color} value={color}>
											{color}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="modifier" className="text-right">
								Modifier
							</Label>
							<Input id="modifier" name="modifier" className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="number" className="text-right">
								Number
							</Label>
							<Input id="number" name="number" className="col-span-3" />
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
