'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
	WebAuthnError,
	browserSupportsWebAuthn,
	startRegistration,
} from '@simplewebauthn/browser';
import { format, formatRelative } from 'date-fns';
import { AlertCircle, Pencil, Trash } from 'lucide-react';
import Image from 'next/image';
import React, { FormEvent, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import aaguids from '../../../(auth)/_data/aaguids.json';
import {
	deletePasskey,
	getRegistrationOptions,
	renamePasskey,
	verifyRegistration,
} from '../../../(auth)/_data/actions';
import { renamePasskeySchema } from '../../../(auth)/_data/schemas';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { Button } from '../../../../components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../../../components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../../../components/ui/dialog';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { useToast } from '../../../../components/ui/use-toast';
import { editEssentialSchema } from '../essentials/_data/schemas';
import { PasskeyDTO } from './_data/fetchers';

export function AuthCardInteractive({ passkeys }: { passkeys: PasskeyDTO[] }) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState('');
	const { toast } = useToast();
	const createPasskey = () =>
		startTransition(async () => {
			const registrationOptions = await getRegistrationOptions();
			let attestationResponse;
			try {
				attestationResponse = await startRegistration(registrationOptions);
			} catch (error) {
				if (error instanceof WebAuthnError) {
					if (error.code == 'ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED') {
						setError('This device has already had a passkey registered to it.');
					} else if (error.code == 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY') {
						setError('The passkey prompt either timed out or was canceled.');
					} else {
						console.log(error);
						setError('An unknown error occurred.');
					}
				} else {
					console.log(error);
					setError('An unknown error occurred.');
				}
				setTimeout(() => setError(''), 10000);

				return;
			}

			const verificationResponse = await verifyRegistration(
				attestationResponse,
				registrationOptions.user.id,
			);

			if (verificationResponse.type === 'failure') {
				if (verificationResponse.code === 'INVALID_PASSKEY') {
					setError("Your passkey couldn't be verified.");
				} else if (verificationResponse.code === 'TIME_OUT') {
					setError('This session has timed out. Please try again.');
				} else {
					setError('An unknown error occurred.');
				}
				setTimeout(() => setError(''), 10000);
			} else {
				toast({ description: 'Passkey added successfully' });
				setError('');
			}
		});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Passkeys</CardTitle>
				<CardDescription>
					Add a passkey to ease signing into your account.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				{error !== '' && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				{passkeys.length > 0 ? (
					<div className="mb-4 flex flex-col gap-2">
						{passkeys.map((passkey) => (
							<PasskeyRow passkey={passkey} key={passkey.id} />
						))}
					</div>
				) : (
					<p className="text-netural-500 mb-2">
						You have no passkeys. Register one by clicking the button below.
					</p>
				)}
				<div>
					<Button
						onClick={createPasskey}
						loading={isPending}
						{...(typeof window !== 'undefined' &&
							!browserSupportsWebAuthn() && { disabled: true })}
					>
						Create Passkey
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function PasskeyRow({ passkey }: { passkey: PasskeyDTO }) {
	return (
		<div className="flex flex-row items-center gap-2 rounded-lg border p-3">
			{'icon_light' in aaguids[passkey.aaguid as keyof typeof aaguids] && (
				<Image
					width={40}
					height={40}
					src={
						// @ts-ignore
						aaguids[passkey.aaguid as keyof typeof aaguids].icon_light
					}
					alt="passkey provider icon"
				/>
			)}
			<div className="flex-1">
				<p className="text-md">{passkey.name}</p>
				<p className="text-sm text-neutral-500">
					Created on: {format(passkey.createdAt, 'LLL dd, y')} | Last used:{' '}
					{passkey.lastUsed
						? formatRelative(passkey.lastUsed, new Date())
						: 'Never'}
				</p>
			</div>
			<EditPasskeyDialog passkey={passkey} />
			<DeletePasskeyDialog passkey={passkey} />
		</div>
	);
}

function EditPasskeyDialog({ passkey }: { passkey: PasskeyDTO }) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof renamePasskeySchema>>({
		resolver: zodResolver(editEssentialSchema),
		defaultValues: {
			name: passkey.name,
		},
	});

	const onSubmit = form.handleSubmit((data) =>
		startTransition(async () => {
			await renamePasskey(passkey.id, data);
			setOpen(false);
		}),
	);

	useEffect(() => {
		form.reset({
			name: passkey.name,
		});
	}, [passkey.name]);
	return (
		<Dialog
			open={open}
			onOpenChange={(newOpen) => {
				if (!newOpen) {
					form.reset({
						name: passkey.name,
					});
					setOpen(false);
				} else {
					setOpen(true);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button size="icon" variant="secondary">
					<Pencil />
				</Button>
			</DialogTrigger>{' '}
			<DialogContent>
				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-8">
						<DialogHeader>
							<DialogTitle>Edit Passkey Name</DialogTitle>
						</DialogHeader>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Name</FormLabel>
									<Input
										disabled={isPending}
										placeholder="Enter a name for this passkey"
										{...field}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit" loading={isPending}>
								Save changes
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

function DeletePasskeyDialog({ passkey }: { passkey: PasskeyDTO }) {
	const [open, setOpen] = useState(false);

	const [isPending, startTransition] = useTransition();
	const onSubmit = (e: FormEvent<HTMLFormElement>) =>
		startTransition(async () => {
			e.preventDefault();
			await deletePasskey(passkey.id);
			setOpen(false);
		});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="icon">
					<Trash />
				</Button>
			</DialogTrigger>
			<DialogContent asChild>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Delete passkey</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete the passkey {passkey.name}? You
							will no longer be able to login with this passkey anymore. This
							action is irreversible
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							onClick={(e) => {
								e.preventDefault();
								setOpen(false);
							}}
							variant="secondary"
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" loading={isPending}>
							Delete
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
