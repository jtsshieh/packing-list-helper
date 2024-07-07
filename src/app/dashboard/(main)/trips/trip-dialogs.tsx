'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trip } from '@prisma/client';
import { format } from 'date-fns';
import { CalendarIcon, Pencil, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, {
	Fragment,
	PropsWithChildren,
	ReactNode,
	useEffect,
	useState,
} from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { createTrip, deleteTrip, editTrip } from '@/data/actions/trip';
import { cn } from '@/lib/utils';

const formSchema = z.object({
	name: z.string(),
	date: z.object({
		from: z.date(),
		to: z.date(),
	}),
});

type BaseCreateEditTripDialogProps =
	| { type: 'create' }
	| { type: 'edit'; trip: Trip };

export function BaseCreateEditTripForm(
	props: BaseCreateEditTripDialogProps & {
		onSubmit: () => void;
		ContentWrapper?: (props: PropsWithChildren) => ReactNode;
		SubmitWrapper?: (props: PropsWithChildren) => ReactNode;
	},
) {
	const { type } = props;
	const ContentWrapper = props.ContentWrapper ?? Fragment;
	const SubmitWrapper = props.SubmitWrapper ?? Fragment;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: type === 'edit' ? props.trip.name : undefined,
			date: {
				from: type === 'edit' ? props.trip.start : undefined,
				to: type === 'edit' ? props.trip.end : undefined,
			},
		},
	});

	useEffect(
		() => {
			if (type === 'edit')
				form.reset({
					name: props.trip.name,
					date: { from: props.trip.start, to: props.trip.end },
				});
		},
		type === 'edit' ? [props.trip.name, props.trip.start, props.trip.end] : [],
	);
	const [state, formAction] = useFormState(
		type === 'create' ? createTrip : editTrip.bind(null, props.trip.id),
		null,
	);
	useEffect(() => {
		if (state && state.type === 'success') {
			props.onSubmit();
			if (type === 'create') form.reset();
		}
	}, [state]);
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(formAction)}>
				<ContentWrapper>
					<div className="flex flex-col gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Give your trip a nice title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Dates</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={'outline'}
													className={cn(
														'pl-3 text-left font-normal',
														!field.value && 'text-muted-foreground',
													)}
												>
													{field.value?.from ? (
														field.value?.to ? (
															<>
																{format(field.value.from, 'LLL dd, y')} -{' '}
																{format(field.value.to, 'LLL dd, y')}
															</>
														) : (
															format(field.value.from, 'LLL dd, y')
														)
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="range"
												defaultMonth={field.value?.from}
												numberOfMonths={2}
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</ContentWrapper>
				<SubmitWrapper>
					<Button type="submit">Save changes</Button>
				</SubmitWrapper>
			</form>
		</Form>
	);
}

function BaseCreateEditTripDialog(props: BaseCreateEditTripDialogProps) {
	const [open, setOpen] = useState(false);

	const { type } = props;

	return (
		<Dialog
			open={open}
			onOpenChange={(newOpen) => {
				if (!newOpen) {
					setOpen(false);
				} else {
					setOpen(true);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button size="icon" variant={type === 'edit' ? 'secondary' : undefined}>
					{type === 'create' ? <Plus /> : <Pencil />}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{type === 'create' ? 'Create' : 'Edit'} Trip
					</DialogTitle>
				</DialogHeader>
				<BaseCreateEditTripForm
					onSubmit={() => setOpen(false)}
					SubmitWrapper={({ children }) => (
						<DialogFooter className="mt-8">{children}</DialogFooter>
					)}
					{...props}
				/>
			</DialogContent>
		</Dialog>
	);
}

export function CreateTripDialog() {
	return <BaseCreateEditTripDialog type="create" />;
}

export function DeleteTripDialog({ trip }: { trip: Trip }) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive">Delete Trip</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete trip</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete {trip.name}? This action is
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
					<Button
						type="submit"
						onClick={async () => {
							await deleteTrip(trip.id);
							router.push('/dashboard/trips');
						}}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
