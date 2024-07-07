import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Skeleton className="h-[32px] w-[250px]" />
				<Skeleton className="h-[24px] w-[450px]" />
			</div>
			<Skeleton className="h-[350px] w-full rounded-xl" />
			<Skeleton className="h-[175px] w-full rounded-xl" />
		</div>
	);
}
