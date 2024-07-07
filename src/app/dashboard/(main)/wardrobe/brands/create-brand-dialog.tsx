'use client';

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
import { createBrand } from '@/data/actions/brand';

export function CreateBrandDialog() {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(createBrand, null);
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
						<DialogTitle>Create brand</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input id="name" name="name" className="col-span-3" />
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
