'use client';

import { Trip } from '@prisma/client';

import {
	BaseCreateEditTripForm,
	DeleteTripDialog,
} from '../../../(main)/trip-dialogs';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../../../../../components/ui/card';
import { useToast } from '../../../../../components/ui/use-toast';

export function ManageTrip({ trip }: { trip: Trip }) {
	const { toast } = useToast();
	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-xl">Trip Details</CardTitle>
					<CardDescription>
						Edit the details of your trip here. Keep in mind that changing the
						trip dates may cause any provisions you have created to be deleted.
					</CardDescription>
				</CardHeader>
				<BaseCreateEditTripForm
					type="edit"
					trip={trip}
					onSubmit={() =>
						toast({
							variant: 'success',
							description: 'Edited the trip successfully',
						})
					}
					ContentWrapper={CardContent}
					SubmitWrapper={({ children }) => (
						<CardFooter className="mt-4 justify-end bg-neutral-100 py-4">
							{children}
						</CardFooter>
					)}
				/>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-xl">Delete Trip</CardTitle>
					<CardDescription>
						This trip and all associated data will be permanently deleted. This
						action is irreversible.
					</CardDescription>
				</CardHeader>
				<CardFooter className="mt-4 justify-end bg-red-100 py-4">
					<DeleteTripDialog trip={trip} />
				</CardFooter>
			</Card>
		</div>
	);
}
