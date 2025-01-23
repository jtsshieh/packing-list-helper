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
import { Container } from '@prisma/client';
import { LexoRank } from 'lexorank';
import { CSSProperties, startTransition, useOptimistic, useState } from 'react';

import { EmptyList } from '../../../../../components/empty-list';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../../../../../components/ui/card';
import { cn } from '../../../../../lib/utils';
import { editContainer } from './_data/actions';
import {
	DeleteContainerDialog,
	EditContainerDialog,
} from './container-dialogs';

interface UpdatePayload {
	idx: number;
	order: string;
}

export function ContainerList({
	containers,
	sorting,
}: {
	containers: Container[];
	sorting: boolean;
}) {
	const sensors = useSensors(useSensor(PointerSensor));

	const [items, updateOrder] = useOptimistic(
		containers,
		(currentContainers, updatePayload: UpdatePayload) => {
			const newContainers = [...currentContainers];
			newContainers[updatePayload.idx] = {
				...newContainers[updatePayload.idx],
				order: updatePayload.order,
			};
			return newContainers.sort((a, b) => a.order.localeCompare(b.order));
		},
	);

	const [activeId, setActiveId] = useState<string | null>(null);

	if (containers.length === 0)
		return (
			<EmptyList
				main="You have no containers"
				sub="You can create one by clicking the Add Container button in the top right corner."
			/>
		);

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
				await editContainer(items[oldIndex].id, {
					order: order.toString(),
				});
			}

			setActiveId(null);
		});
	return (
		<div className="grid auto-rows-fr grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={items}>
					{items.map((container) => (
						<SortableContainer
							container={container}
							key={container.id}
							sorting={sorting}
						/>
					))}
				</SortableContext>
				<DragOverlay modifiers={[restrictToWindowEdges]}>
					{activeId ? (
						<ContainerCard
							container={
								containers.find((pc) => pc.id === activeId) as Container
							}
							sorting={true}
							overlay={true}
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}

function SortableContainer({
	container,
	sorting,
}: {
	container: Container;
	sorting: boolean;
}) {
	const {
		isDragging,
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: container.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};
	return (
		<ContainerCard
			container={container}
			style={style}
			setNodeRef={sorting ? setNodeRef : undefined}
			attributes={sorting ? attributes : undefined}
			listeners={sorting ? listeners : undefined}
			isDragging={isDragging}
			sorting={sorting}
		/>
	);
}

function ContainerCard({
	container,
	style,
	setNodeRef,
	attributes,
	listeners,
	isDragging = false,
	sorting = false,
	overlay = false,
}: {
	container: Container;
	style?: CSSProperties;
	setNodeRef?: (node: HTMLElement | null) => void;
	attributes?: DraggableAttributes;
	listeners?: SyntheticListenerMap;
	isDragging?: boolean;
	sorting?: boolean;
	overlay?: boolean;
}) {
	return (
		<Card
			className={cn(
				'flex h-full flex-col',
				isDragging && 'opacity-50',
				sorting && 'cursor-grab touch-none select-none',
				overlay && 'shadow-2xl',
			)}
			style={style}
			ref={setNodeRef}
			{...listeners}
			{...attributes}
		>
			<CardHeader className="flex-1 flex-row justify-between gap-2">
				<div className="flex flex-col">
					<CardTitle>{container.name}</CardTitle>
					<CardDescription>{container.type}</CardDescription>
				</div>
			</CardHeader>
			<CardFooter className="justify-between">
				<DeleteContainerDialog container={container} disabled={sorting} />
				<EditContainerDialog container={container} disabled={sorting} />
			</CardFooter>
		</Card>
	);
}
