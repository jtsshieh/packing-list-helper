'use client';

import { EssentialCategory } from '@prisma/client';
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
import { createEssential } from '@/data/actions/essential';

export function CreateEssentialDialog() {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(createEssential, null);
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
						<DialogTitle>Create essential</DialogTitle>
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
								<Input id="name" name="name" className="col-span-3" />
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
