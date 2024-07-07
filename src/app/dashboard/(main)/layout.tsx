import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { getCurrentUser } from '../../../data/fetchers/user';
import { DashboardNav } from './dashboard-nav';

export default async function DashboardLayout({ children }: PropsWithChildren) {
	const user = await getCurrentUser();
	if (!user) return redirect('/sign-in');

	return (
		<div className="flex h-svh w-screen flex-col">
			<DashboardNav user={user} />
			<div className="flex-1 border-t bg-neutral-50 p-8">{children}</div>
		</div>
	);
}
