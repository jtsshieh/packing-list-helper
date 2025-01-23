import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<Skeleton className="h-[40px] w-[40px]" />
				<div className="flex flex-1 flex-col gap-1">
					<Skeleton className="h-[32px] w-[250px]" />
					<Skeleton className="h-[24px] w-full" />
				</div>
				<Skeleton className="h-[40px] w-[40px] md:w-[150px]" />
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Skeleton className="h-[200px] w-full rounded-xl" />
				<Skeleton className="h-[200px] w-full rounded-xl" />
				<Skeleton className="h-[200px] w-full rounded-xl" />
			</div>
		</div>
	);
}
