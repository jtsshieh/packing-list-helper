'use client';

import { Briefcase, Home, PillBottle, Shirt } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { signOut } from '../../../data/actions/user';
import { ClientUser } from '../../../data/fetchers/user';

const navLinks = [
	{ name: 'Home', icon: <Home />, href: '' },
	{ name: 'Wardrobe', icon: <Shirt />, href: 'wardrobe' },
	{ name: 'Essentials', icon: <PillBottle />, href: 'essentials' },
	{ name: 'Trips', icon: <Briefcase />, href: 'trips' },
];

export function DashboardNav({ user }: { user: ClientUser }) {
	const pathname = usePathname();
	return (
		<nav className="my-2 flex w-full justify-between px-4">
			<div className="flex gap-2">
				{navLinks.map(({ name, icon, href }) => (
					<Button
						key={name}
						variant="ghost"
						asChild
						className={cn(
							'flex gap-2',
							(pathname.split('/')[2] ?? '') === href && 'bg-neutral-100',
						)}
					>
						<Link href={`/dashboard/${href}`}>
							{icon} {name}
						</Link>
					</Button>
				))}
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarFallback>:)</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>{user.username}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href="/dashboard/account">Settings</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => signOut()}>
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	);
}
