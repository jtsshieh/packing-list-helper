import { redirect } from 'next/navigation';
import React, { PropsWithChildren } from 'react';

import { getCurrentUser } from './account/_data/fetchers';
import { DashboardNav, MobileDashboardNav } from './dashboard-nav';

export default async function DashboardLayout({ children }: PropsWithChildren) {
	const user = await getCurrentUser();
	if (!user) return redirect('/sign-in');

	return (
		<div className="flex h-svh w-screen flex-col">
			<div className="hidden sm:block">
				<DashboardNav user={user} />
			</div>
			<div className="flex justify-end p-2 px-4 sm:hidden">
				<MobileDashboardNav user={user} />
			</div>
			<div className="flex flex-1 border-t bg-neutral-50 p-8">{children}</div>
		</div>
	);
}
