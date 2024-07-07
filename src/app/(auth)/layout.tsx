import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { getCurrentUser } from '../../data/fetchers/user';

export default async function AuthLayout({ children }: PropsWithChildren) {
	const user = await getCurrentUser();
	if (user) return redirect('/dashboard');

	return <>{children}</>;
}
