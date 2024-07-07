'use client';

import { Brand, Clothing, ClothingType } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { deleteClothing, editClothing } from '@/data/actions/clothing';
import { generateClothingName } from '@/lib/generate-clothing-name';

import { colors } from './constants';

interface WardrobeListProps {
	brands: Brand[];
	types: (ClothingType & { clothes: Clothing[] })[];
}

export function WardrobeList({ brands, types }: WardrobeListProps) {
	return (
		<div className="flex flex-col gap-8">
			{types
				.filter((type) => type.clothes.length !== 0)
				.map((type) => (
					<div>
						<h3 className="mb-2 text-xl font-bold">{type.name}</h3>
						<div className="grid grid-cols-4 gap-2">
							{type.clothes.map((clothing) => (
								<Card key={clothing.id} className="flex flex-col">
									<CardHeader className="flex-1">
										<CardTitle>{generateClothingName(clothing)}</CardTitle>
										<CardDescription></CardDescription>
									</CardHeader>
									<CardFooter className="justify-between">
										<DeleteClothingDialog clothing={clothing} />
										<EditClothingDialog
											clothing={clothing}
											brands={brands}
											types={types}
										/>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				))}
		</div>
	);
}

function EditClothingDialog({
	clothing,
	brands,
	types,
}: {
	clothing: Clothing;
	brands: Brand[];
	types: ClothingType[];
}) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(
		editClothing.bind(null, clothing.id),
		null,
	);
	useEffect(() => {
		if (state && state.type === 'success') {
			setOpen(false);
		}
	}, [state]);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="secondary">Edit</Button>
			</DialogTrigger>
			<DialogContent asChild>
				<form action={formAction}>
					<DialogHeader>
						<DialogTitle>Edit clothing</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="type" className="text-right">
								Type
							</Label>
							<Select name="type" defaultValue={clothing.typeName}>
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
							<Select name="brand" defaultValue={clothing.brandName}>
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
							<Input
								id="brand-line"
								name="brandLine"
								className="col-span-3"
								defaultValue={clothing.brandLine ?? ''}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="color" className="text-right">
								Color
							</Label>
							<Select name="color" defaultValue={clothing.color}>
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
							<Input
								id="modifier"
								name="modifier"
								className="col-span-3"
								defaultValue={clothing.modifier ?? ''}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="number" className="text-right">
								Number
							</Label>
							<Input
								id="number"
								name="number"
								className="col-span-3"
								defaultValue={clothing.number ?? ''}
							/>
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

function DeleteClothingDialog({ clothing }: { clothing: Clothing }) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(
		deleteClothing.bind(null, clothing.id),
		null,
	);
	useEffect(() => {
		if (state && state.type === 'success') {
			setOpen(false);
		}
	}, [state]);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="destructive">
					<Trash />
				</Button>
			</DialogTrigger>
			<DialogContent asChild>
				<form action={formAction}>
					<DialogHeader>
						<DialogTitle>Delete clothing</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete {generateClothingName(clothing)}?
							This action is irreversible.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							onClick={(e) => {
								e.preventDefault();
								setOpen(false);
							}}
							variant="secondary"
						>
							Cancel
						</Button>
						<Button type="submit">Delete</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
