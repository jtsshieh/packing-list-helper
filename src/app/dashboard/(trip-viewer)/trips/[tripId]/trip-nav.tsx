'use client';

import { TripMode } from '@prisma/client';
import {
	Home,
	Kanban,
	Luggage,
	PillBottle,
	Search,
	Settings,
	Shirt,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { changeTripMode } from '@/data/actions/trip';
import { cn } from '@/lib/utils';

const navRoutes = [
	{
		name: 'Home',
		icon: <Home />,
		href: '',
		mode: [TripMode.Provision, TripMode.Pack, TripMode.Audit],
	},
	{
		name: 'Clothing',
		icon: <Shirt />,
		href: 'clothing',
		mode: [TripMode.Provision],
	},
	{
		name: 'Essentials',
		icon: <PillBottle />,
		href: 'essentials',
		mode: [TripMode.Provision],
	},
	{
		name: 'Manage Trip',
		icon: <Settings />,
		href: 'manage',
		mode: [TripMode.Provision, TripMode.Pack, TripMode.Audit],
	},
];
export function TripSideNav({
	tripId,
	tripMode,
}: {
	tripId: string;
	tripMode: TripMode;
}) {
	const pathname = usePathname();
	return (
		<nav className="flex flex-col gap-2 border-r p-4">
			{navRoutes
				.filter((route) => route.mode.includes(tripMode))
				.map(({ href, icon, name }) => (
					<Button
						key={href}
						variant="ghost"
						className={cn(
							'w-full justify-start gap-2 text-left',
							(pathname.split('/')[4] ?? '') === href && 'bg-neutral-100',
						)}
						asChild
					>
						<Link href={`/dashboard/trips/${tripId}/${href}`}>
							{icon} {name}
						</Link>
					</Button>
				))}
		</nav>
	);
}
export function TripModeSelector({
	tripId,
	tripMode,
}: {
	tripId: string;
	tripMode: TripMode;
}) {
	return (
		<Select
			value={tripMode}
			onValueChange={async (value) => {
				await changeTripMode(tripId, { mode: value });
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="Provision">
					<div className="flex items-center gap-1">
						<Kanban /> Provisioning
					</div>
				</SelectItem>
				<SelectItem value="Pack">
					<div className="flex items-center gap-1">
						<Luggage /> Packing
					</div>
				</SelectItem>
				<SelectItem value="Audit">
					<div className="flex items-center gap-1">
						<Search /> Auditing
					</div>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}
