'use client';

import {
	CollisionDetection,
	DndContext,
	DragEndEvent,
	PointerSensor,
	UniqueIdentifier,
	closestCenter,
	getFirstCollision,
	pointerWithin,
	rectIntersection,
	useDroppable,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Clothing,
	ClothingProvision,
	Container,
	ContainerProvision,
	ContainerType,
	Essential,
	EssentialProvision,
} from '@prisma/client';
import { LexoRank } from 'lexorank';
import { Menu } from 'lucide-react';
import React, {
	startTransition,
	useCallback,
	useOptimistic,
	useState,
} from 'react';

import { EmptyList } from '../../../../../../components/empty-list';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../../../../../components/ui/card';
import { generateClothingName } from '../../../../../../lib/generate-clothing-name';
import { cn } from '../../../../../../lib/utils';
import {
	changeClothingProvisionContainerOrder,
	changeEssentialProvisionContainerOrder,
} from './_data/actions';
import { getTripWithContainerProvisions } from './_data/fetchers';
import {
	AddToContainerClothingDialog,
	AddToContainerEssentialDialog,
} from './add-to-container-dialog';
import { DeleteContainerProvisionDialog } from './container-provision-dialogs';
import {
	DeleteFromContainerClothing,
	DeleteFromContainerEssential,
} from './delete-from-container-dialog';

interface ContainerProvisionListProps {
	trip: NonNullable<Awaited<ReturnType<typeof getTripWithContainerProvisions>>>;
}

interface UpdatePayload {
	containerProvisionId: string;
	idx: number;
	order: string;
}

export function ContainerProvisionList({ trip }: ContainerProvisionListProps) {
	const sensors = useSensors(useSensor(PointerSensor));
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

	const [containerProvisions, updateOrder] = useOptimistic(
		trip.containerProvisions,
		(currentContainerProvisions, updatePayload: UpdatePayload) => {
			const newContainerProvisions = [...currentContainerProvisions];
			const containerProvisionIdx = newContainerProvisions.findIndex(
				(p) => p.id === updatePayload.containerProvisionId,
			);

			if (containerProvisionIdx === -1) return newContainerProvisions;

			const currentContainerProvision =
				newContainerProvisions[containerProvisionIdx];

			const propName =
				currentContainerProvision.container.type === ContainerType.Clothes
					? 'clothingProvisions'
					: 'essentialProvisions';

			newContainerProvisions[containerProvisionIdx] = {
				...newContainerProvisions[containerProvisionIdx],
				[propName]: [...currentContainerProvision[propName]],
			};

			const newContainerProvision =
				newContainerProvisions[containerProvisionIdx];

			newContainerProvision[propName][updatePayload.idx] = {
				...newContainerProvision[propName][updatePayload.idx],
				containerOrder: updatePayload.order,
			};

			newContainerProvision[propName].sort((a, b) =>
				a.containerOrder!.localeCompare(b.containerOrder!),
			);
			console.log(updatePayload);
			console.log(JSON.stringify(newContainerProvision[propName]));

			return newContainerProvisions;
		},
	);

	const collisionDetectionStrategy: CollisionDetection = useCallback(
		(args) => {
			// Start by finding any intersecting droppable
			const pointerIntersections = pointerWithin(args);
			const intersections =
				pointerIntersections.length > 0
					? // If there are droppables intersecting with the pointer, return those
						pointerIntersections
					: rectIntersection(args);
			let overId = getFirstCollision(intersections, 'id');

			if (overId != null) {
				const provision = containerProvisions.find((p) => p.id === overId);

				// mouse is over a container--need to override with a container item
				if (provision) {
					const propName =
						provision.container.type === ContainerType.Clothes
							? 'clothingProvisions'
							: 'essentialProvisions';

					// If a container is matched and it contains items (columns 'A', 'B', 'C')
					if (provision[propName].length > 0) {
						// Return the closest droppable within that container
						overId = closestCenter({
							...args,
							droppableContainers: args.droppableContainers.filter(
								(container) =>
									container.id !== overId &&
									provision[propName].some((c) => c.id === container.id),
							),
						})[0]?.id;
					}
				}

				// lastOverId.current = overId;

				return [{ id: overId }];
			}

			return intersections;

			// // When a draggable item moves to a new container, the layout may shift
			// // and the `overId` may become `null`. We manually set the cached `lastOverId`
			// // to the id of the draggable item that was moved to the new container, otherwise
			// // the previous `overId` will be returned which can cause items to incorrectly shift positions
			// if (recentlyMovedToNewContainer.current) {
			// 	lastOverId.current = activeId;
			// }
			//
			// // If no droppable is matched, return the last match
			// return lastOverId.current ? [{ id: lastOverId.current }] : [];
		},
		[activeId, containerProvisions],
	);

	if (trip.containerProvisions.length === 0) {
		return (
			<EmptyList
				main="You have not added any containers to this trip"
				sub="You can start assigning your provisioned items as soon as you add a container."
			/>
		);
	}

	const unusedClothingProvisions = trip.clothingProvisions.filter((a) => {
		const isUnused = !trip.containerProvisions.some((b) =>
			b.clothingProvisions.some((c) => a.id === c.id),
		);

		if (!isUnused) return false;

		const reused = trip.clothingProvisions.filter(
			(c) => c.clothingId === a.clothingId,
		);
		if (reused.length === 1) {
			return true;
		} else {
			return reused[0].id === a.id;
		}
	});

	const unusedEssentialProvisions = trip.essentialProvisions.filter(
		(a) =>
			!trip.containerProvisions.some((b) =>
				b.essentialProvisions.some((c) => a.id === c.id),
			),
	);

	function findContainerProvision(provisionId: string) {
		return trip.containerProvisions.find((containerProvision) => {
			const isClothes =
				containerProvision.container.type === ContainerType.Clothes;
			const children = isClothes
				? containerProvision.clothingProvisions
				: containerProvision.essentialProvisions;

			return children.some((provision) => provision.id === provisionId);
		});
	}
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over || !active) return;

		if (over.data?.current?.allowed === active.data?.current?.allowed) {
			startTransition(async () => {
				if (active.id !== over?.id) {
					const containerProvision = findContainerProvision(
						active.id as string,
					);
					if (!containerProvision) return; // todo: handle this error
					const isClothes =
						containerProvision.container.type === ContainerType.Clothes;
					const items = isClothes
						? containerProvision.clothingProvisions
						: containerProvision.essentialProvisions;
					console.log('items', items);

					const oldIndex = items.findIndex((x) => x.id === active.id);
					const newIndex = items.findIndex((x) => x.id === over?.id);

					let order;
					if (newIndex === 0) {
						const next = items[newIndex];
						order = LexoRank.parse(next.containerOrder!).genPrev();
					} else if (newIndex === items.length - 1) {
						const prev = items[newIndex];
						order = LexoRank.parse(prev.containerOrder!).genNext();
					} else {
						const prev = items[newIndex];
						const offset = oldIndex > newIndex ? -1 : 1;
						const next = items[newIndex + offset];
						order = LexoRank.parse(next.containerOrder!).between(
							LexoRank.parse(prev.containerOrder!),
						);
					}

					updateOrder({
						idx: oldIndex,
						order: order.toString(),
						containerProvisionId: containerProvision.id,
					});
					await (
						isClothes
							? changeClothingProvisionContainerOrder
							: changeEssentialProvisionContainerOrder
					)(items[oldIndex].id, order.toString());
					// if (over.data?.current?.allowed === 'clothing') {
					// 	await addClothingProvisionToContainer(
					// 		over.id as string,
					// 		active.id as string,
					// 	);
					// } else {
					// 	await addEssentialProvisionToContainer(
					// 		over.id as string,
					// 		active.id as string,
					// 	);
					// }
				}
			});
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={collisionDetectionStrategy}
			onDragEnd={handleDragEnd}
		>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{containerProvisions.map((containerProvision) => (
					<ContainerProvisionCard
						key={containerProvision.id}
						containerProvision={containerProvision}
						unusedEssentialProvisions={unusedEssentialProvisions}
						unusedClothingProvisions={unusedClothingProvisions}
					/>
				))}
			</div>
		</DndContext>
	);
}

function ContainerProvisionCard({
	containerProvision,
	unusedClothingProvisions,
	unusedEssentialProvisions,
}: {
	containerProvision: ContainerProvision & {
		container: Container;
		clothingProvisions: (ClothingProvision & { clothing: Clothing })[];
		essentialProvisions: (EssentialProvision & { essential: Essential })[];
	};

	unusedClothingProvisions: (ClothingProvision & { clothing: Clothing })[];
	unusedEssentialProvisions: (EssentialProvision & { essential: Essential })[];
}) {
	const containerType =
		containerProvision.container.type === ContainerType.Clothes
			? 'clothes'
			: 'essentials';
	const { isOver, active, setNodeRef } = useDroppable({
		id: containerProvision.id,
		data: {
			type: 'container',
			allowed: containerType,
		},
	});

	return (
		<SortableContext
			items={
				containerType === 'clothes'
					? containerProvision.clothingProvisions
					: containerProvision.essentialProvisions
			}
		>
			<Card
				ref={setNodeRef}
				className={cn(
					isOver &&
						(active?.data?.current?.allowed === containerType
							? 'border-dashed bg-neutral-100'
							: 'border-dashed border-red-300 bg-red-50'),
				)}
			>
				<CardHeader className="flex flex-row items-center gap-2 space-y-0">
					<div className="flex-1">
						<CardTitle>{containerProvision.container.name}</CardTitle>
						<CardDescription>
							{containerProvision.container.type}
						</CardDescription>
					</div>
					{containerType === 'clothes' ? (
						<AddToContainerClothingDialog
							clothingProvisions={unusedClothingProvisions}
							containerProvision={containerProvision}
						/>
					) : (
						<AddToContainerEssentialDialog
							essentialProvisions={unusedEssentialProvisions}
							containerProvisions={containerProvision}
						/>
					)}
					<DeleteContainerProvisionDialog
						containerProvision={containerProvision}
					/>
				</CardHeader>
				<CardContent className="flex flex-col">
					{containerType === 'clothes'
						? containerProvision.clothingProvisions.map(({ clothing, id }) => (
								<ClothingProvisionItem
									key={id}
									clothingProvisionId={id}
									clothingName={generateClothingName(clothing)}
									containerProvisionId={containerProvision.id}
								/>
							))
						: containerProvision.essentialProvisions.map(
								({ essential, id }) => (
									<EssentialProvisionItem
										key={id}
										essentialProvisionId={id}
										essentialName={essential.name}
										containerProvisionId={containerProvision.id}
									/>
								),
							)}
				</CardContent>
			</Card>
		</SortableContext>
	);
}

function ClothingProvisionItem({
	clothingProvisionId,
	clothingName,
	containerProvisionId,
}: {
	clothingProvisionId: string;
	clothingName: string;
	containerProvisionId: string;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: clothingProvisionId,
		data: {
			allowed: 'clothes',
		},
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<div
			className={cn(
				'flex cursor-default touch-none select-none items-center justify-between gap-2 rounded-lg p-1',
				isDragging && 'z-50 bg-white shadow-2xl',
			)}
			ref={setNodeRef}
			style={style}
		>
			<Menu {...listeners} className="cursor-grab text-neutral-400" />
			<p className="text-md flex-1">{clothingName}</p>
			<DeleteFromContainerClothing
				clothingProvisionId={clothingProvisionId}
				containerProvisionId={containerProvisionId}
			/>
		</div>
	);
}

function EssentialProvisionItem({
	essentialProvisionId,
	essentialName,
	containerProvisionId,
}: {
	essentialProvisionId: string;
	essentialName: string;
	containerProvisionId: string;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: essentialProvisionId,
		data: {
			allowed: 'essentials',
		},
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<div
			className={cn(
				'flex cursor-default touch-none select-none items-center justify-between gap-2 rounded-lg p-1',
				isDragging && 'z-50 bg-white shadow-2xl',
			)}
			ref={setNodeRef}
			style={style}
		>
			<Menu {...listeners} className="cursor-grab text-neutral-400" />
			<p className="text-md flex-1">{essentialName}</p>
			<DeleteFromContainerEssential
				essentialProvisionId={essentialProvisionId}
				containerProvisionId={containerProvisionId}
			/>
		</div>
	);
}
