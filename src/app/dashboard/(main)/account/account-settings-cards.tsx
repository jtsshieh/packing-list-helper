'use client';

import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';

import { Button } from '../../../../components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
import { Input } from '../../../../components/ui/input';
import { useToast } from '../../../../components/ui/use-toast';
import { changeUsername, deleteUser } from '../../../../data/actions/user';
import { ClientUser } from '../../../../data/fetchers/user';

export function AccountSettingsCards({ user }: { user: ClientUser }) {
	const [username, setUsername] = useState(user.username);
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();
	const onSaveUsernameChange = () =>
		startTransition(async () => {
			const result = await changeUsername(username);
			if (!result.success) {
				toast({
					variant: 'destructive',

					description: 'That username is taken. Choose another one.',
				});
			} else {
				toast({
					description: `Your username has successfully been changed to ${username}`,
				});
			}
		});
	return (
		<div className="flex w-full flex-col gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Username</CardTitle>
					<CardDescription>
						Choose a unique username that'll server as your credential for
						logging in.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Input
						disabled={isPending}
						className="w-[300px]"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</CardContent>
				<CardFooter className="flex justify-end bg-neutral-100 py-4">
					<Button onClick={onSaveUsernameChange}>
						{isPending ? (
							<LoaderCircle className="h-4 w-4 animate-spin" />
						) : (
							'Save'
						)}
					</Button>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Delete Account</CardTitle>
					<CardDescription>
						This account and all associated data including clothes, essentials,
						and trips will be permanently deleted. This action is irreversible.
					</CardDescription>
				</CardHeader>
				<CardFooter className="mt-4 justify-end bg-red-100 py-4">
					<DeleteAccountDialog />
				</CardFooter>
			</Card>
		</div>
	);
}

function DeleteAccountDialog() {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive">Delete account</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete account</DialogTitle>
					<DialogDescription>
						Are you sure you want to your account? All associated data including
						clothing, essentials, and trips will be permanently deleted. This
						action is irreversible.
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
						variant="destructive"
						onClick={async () => {
							await deleteUser();
							router.push('/sign-in');
						}}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
