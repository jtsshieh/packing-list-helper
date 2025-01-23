'use client';

import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	DraggableAttributes,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { File, HandSoap, Plug } from '@phosphor-icons/react';
import {
	Essential,
	EssentialCategory,
	EssentialProvision,
} from '@prisma/client';
import { LexoRank } from 'lexorank';
import { Menu, TrashIcon } from 'lucide-react';
import React, {
	CSSProperties,
	startTransition,
	useOptimistic,
	useState,
	useTransition,
} from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import {
	changeEssentialProvisionOrder,
	deleteEssentialProvision,
} from './_data/actions';

const essentialCategories = [
	{
		category: EssentialCategory.Toiletry,
		icon: <HandSoap />,
		name: 'Toiletries',
	},
	{ category: EssentialCategory.Document, icon: <File />, name: 'Documents' },
	{
		category: EssentialCategory.Electronic,
		icon: <Plug />,
		name: 'Electronics',
	},
];
export function EssentialProvisionList({
	groups,
}: {
	groups: Record<
		EssentialCategory,
		(EssentialProvision & { essential: Essential })[]
	>;
}) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{essentialCategories.map((categoryData) => (
				<EssentialCategoryCard
					key={categoryData.category}
					meta={categoryData}
					provisions={groups[categoryData.category]}
				/>
			))}
		</div>
	);
}

type UnwrapArray<A> = A extends unknown[] ? UnwrapArray<A[number]> : A;
interface UpdatePayload {
	idx: number;
	order: string;
}

function EssentialCategoryCard({
	meta: { category, icon, name },
	provisions,
}: {
	meta: UnwrapArray<typeof essentialCategories>;
	provisions: (EssentialProvision & { essential: Essential })[];
}) {
	const sensors = useSensors(useSensor(PointerSensor));
	const [items, updateOrder] = useOptimistic(
		provisions,
		(currentProvisions, updatePayload: UpdatePayload) => {
			const newProvisions = [...currentProvisions];
			newProvisions[updatePayload.idx] = {
				...newProvisions[updatePayload.idx],
				order: updatePayload.order,
			};
			return newProvisions.sort((a, b) => a.order.localeCompare(b.order));
		},
	);
	const [activeId, setActiveId] = useState<string | null>(null);

	function handleDragStart(event: DragStartEvent) {
		const { active } = event;
		setActiveId(active.id as string);
	}

	const handleDragEnd = (event: DragEndEvent) =>
		startTransition(async () => {
			const { active, over } = event;
			if (active.id !== over?.id) {
				const oldIndex = items.findIndex((x) => x.id === active.id);
				const newIndex = items.findIndex((x) => x.id === over?.id);

				let order;
				if (newIndex === 0) {
					const next = items[newIndex];
					order = LexoRank.parse(next.order).genPrev();
				} else if (newIndex === items.length - 1) {
					const prev = items[newIndex];
					order = LexoRank.parse(prev.order).genNext();
				} else {
					const prev = items[newIndex];
					const offset = oldIndex > newIndex ? -1 : 1;
					const next = items[newIndex + offset];
					order = LexoRank.parse(next.order).between(
						LexoRank.parse(prev.order),
					);
				}

				updateOrder({ idx: oldIndex, order: order.toString() });
				await changeEssentialProvisionOrder(
					items[oldIndex].id,
					order.toString(),
				);
			}

			setActiveId(null);
		});

	return (
		<Card key={category}>
			<CardHeader>
				<CardTitle className="flex gap-2">
					{icon} {name}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					<SortableContext items={items}>
						{items.map((provision, i) => (
							<SortableEssentialProvision
								key={provision.id}
								provision={provision}
							/>
						))}
					</SortableContext>
					<DragOverlay modifiers={[restrictToWindowEdges]}>
						{activeId ? (
							<EssentialProvisionItem
								provision={
									provisions.find(
										(l) => l.id === activeId,
									) as EssentialProvision & { essential: Essential }
								}
								overlay={true}
							/>
						) : null}
					</DragOverlay>
				</DndContext>
			</CardContent>
		</Card>
	);
}

function SortableEssentialProvision({
	provision,
}: {
	provision: EssentialProvision & { essential: Essential };
}) {
	const {
		isDragging,
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: provision.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};
	return (
		<EssentialProvisionItem
			provision={provision}
			style={style}
			setNodeRef={setNodeRef}
			attributes={attributes}
			listeners={listeners}
			isDragging={isDragging}
		/>
	);
}

function EssentialProvisionItem({
	provision,
	style,
	setNodeRef,
	attributes,
	listeners,
	isDragging = false,
	overlay = false,
}: {
	provision: EssentialProvision & { essential: Essential };
	style?: CSSProperties;
	setNodeRef?: (node: HTMLElement | null) => void;
	attributes?: DraggableAttributes;
	listeners?: SyntheticListenerMap;
	isDragging?: boolean;
	overlay?: boolean;
}) {
	return (
		<div
			key={provision.id}
			style={style}
			ref={setNodeRef}
			className={cn(
				'flex cursor-default touch-none select-none items-center justify-between gap-2 rounded-lg bg-white py-1',
				isDragging && 'opacity-50',
				overlay && 'shadow-lg',
			)}
			{...attributes}
		>
			<Menu {...listeners} className="cursor-grab text-neutral-400" />
			<p className="flex-1 text-base">{provision.essential.name}</p>
			<EssentialProvisionDelete provisionId={provision.id} />
		</div>
	);
}

function EssentialProvisionDelete({ provisionId }: { provisionId: string }) {
	const [isPending, startTransition] = useTransition();
	const onClick = () =>
		startTransition(async () => {
			await deleteEssentialProvision(provisionId);
		});
	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={onClick}
			className="h-8 w-8"
			loading={isPending}
		>
			{!isPending && <TrashIcon size={16} />}
		</Button>
	);
}
