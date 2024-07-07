'use client';

import { Brand } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { deleteBrand, editBrand } from '@/data/actions/brand';

interface BrandsListProps {
	brands: Brand[];
}

export function BrandsList({ brands }: BrandsListProps) {
	return (
		<>
			<div className="grid grid-cols-4 gap-2">
				{brands.map((brand) => (
					<Card key={brand.name}>
						<CardHeader>
							<CardTitle>{brand.name}</CardTitle>
						</CardHeader>
						<CardFooter className="justify-between">
							<DeleteBrandDialog brand={brand} />
							<EditBrandDialog brand={brand} />
						</CardFooter>
					</Card>
				))}
			</div>
		</>
	);
}

function EditBrandDialog({ brand }: { brand: Brand }) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(
		editBrand.bind(null, brand.name),
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
				<Button>Edit</Button>
			</DialogTrigger>
			<DialogContent asChild>
				<form action={formAction}>
					<DialogHeader>
						<DialogTitle>Edit brand</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input
								id="name"
								name="name"
								className="col-span-3"
								defaultValue={brand.name}
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

function DeleteBrandDialog({ brand }: { brand: Brand }) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(
		deleteBrand.bind(null, brand.name),
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
						<DialogTitle>Delete brand</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete {brand.name}? This action is
							irreversible.
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
