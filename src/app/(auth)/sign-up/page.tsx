'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { createUser } from '../../../data/actions/user';

const formSchema = z.object({
	username: z.string(),
	password: z.string(),
});

export default function SignupPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState(false);

	const formAction = (values: z.infer<typeof formSchema>) => {
		startTransition(async () => {
			const result = await createUser(values.username, values.password);

			if (result.success) {
				router.push('/dashboard');
			} else {
				setError(true);
			}
		});
	};

	return (
		<div className="flex h-svh w-screen items-center justify-center">
			<div className="absolute top-0 flex w-full justify-end p-8">
				<Button variant="secondary">
					<Link href="/sign-in">Sign in</Link>
				</Button>
			</div>
			<div className="flex w-full max-w-[500px] flex-col gap-4 p-8">
				<h1 className="text-center text-3xl font-bold">Sign up</h1>
				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							This username is taken. Please choose another.
						</AlertDescription>
					</Alert>
				)}
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(formAction)}
						className="flex flex-col gap-4"
					>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="Enter a username"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="Enter a password"
											type="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button disabled={isPending} className="w-full" type="submit">
							{isPending ? (
								<LoaderCircle className="h-4 w-4 animate-spin" />
							) : (
								'Sign up'
							)}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
