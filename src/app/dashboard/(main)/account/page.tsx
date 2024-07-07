import { redirect } from 'next/navigation';
import React from 'react';

import { getCurrentUser } from '../../../../data/fetchers/user';
import { AccountSettingsCards } from './account-settings-cards';

export default async function UserSettingsPage() {
	const user = await getCurrentUser();
	if (!user) redirect('/sign-in');

	return (
		<div className="flex justify-center">
			<div className="flex max-w-screen-md flex-col">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-3xl font-bold">Account Settings</h1>
				</div>
				<AccountSettingsCards user={user} />
			</div>
		</div>
	);
}
