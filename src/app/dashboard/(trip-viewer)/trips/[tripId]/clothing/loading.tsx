import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingPage() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<Skeleton className="h-[32px] w-[250px]" />
					<Skeleton className="h-[24px] w-[450px]" />
				</div>
				<Skeleton className="h-[40px] w-[150px]" />
			</div>
			<Skeleton className="h-[200px] w-full rounded-xl" />
			<Skeleton className="h-[200px] w-full rounded-xl" />
			<Skeleton className="h-[200px] w-full rounded-xl" />
			<Skeleton className="h-[200px] w-full rounded-xl" />
		</div>
	);
}
