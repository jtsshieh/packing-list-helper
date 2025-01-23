import { redirect } from 'next/navigation';

export default async function PackingGear() {
	redirect('/dashboard/packing-gear/luggage');
	return null;
}
