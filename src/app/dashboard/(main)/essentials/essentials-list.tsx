'use client';

import { Essential, EssentialCategory } from '@prisma/client';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { deleteEssential, editEssential } from '@/data/actions/essential';

interface EssentialsListProps {
	essentials: Essential[];
}

export function EssentialsList({ essentials }: EssentialsListProps) {
	return (
		<div className="flex flex-col gap-8">
			{Object.values(EssentialCategory).map((category) => (
				<div>
					<h3 className="mb-2 text-xl font-bold">{category}</h3>
					<div className="grid grid-cols-4 gap-2">
						{essentials
							.filter((essential) => essential.category === category)
							.map((essential) => (
								<Card key={essential.id} className="flex flex-col">
									<CardHeader className="flex-1">
										<CardTitle>{essential.name}</CardTitle>
									</CardHeader>
									<CardFooter className="justify-between">
										<DeleteEssentialDialog essential={essential} />
										<EditEssentialDialog essential={essential} />
									</CardFooter>
								</Card>
							))}
					</div>
				</div>
			))}
		</div>
	);
}

function EditEssentialDialog({ essential }: { essential: Essential }) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(
		editEssential.bind(null, essential.id),
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
						<DialogTitle>Edit essential</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="category" className="text-right">
									Category
								</Label>
								<Select name="category">
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select the type of essential" />
									</SelectTrigger>
									<SelectContent>
										{Object.keys(EssentialCategory).map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input
									id="name"
									name="name"
									className="col-span-3"
									defaultValue={essential.name}
								/>
							</div>
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

function DeleteEssentialDialog({ essential }: { essential: Essential }) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(
		deleteEssential.bind(null, essential.id),
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
						<DialogTitle>Delete essential</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete {essential.name}? This action is
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
