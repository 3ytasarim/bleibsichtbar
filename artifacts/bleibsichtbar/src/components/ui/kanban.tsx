// Adapted from the 21st.dev registry (haydenbleasel/kanban) — a thin,
// generic drag-and-drop board built on @dnd-kit/core. Board/column/card
// content is fully up to the caller (see AdminRoadmapBoard.tsx).
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DndContext, rectIntersection, useDraggable, useDroppable } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import type { ReactNode } from "react";

export type KanbanBoardProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      className={cn(
        "flex h-full min-h-40 flex-col gap-2 rounded-xl border bg-muted/40 p-2 text-xs shadow-sm outline outline-2 transition-all",
        isOver ? "outline-[#2563eb]" : "outline-transparent",
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
};

export type KanbanCardProps = {
  id: string;
  index: number;
  parent: string;
  children?: ReactNode;
  className?: string;
};

export const KanbanCard = ({ id, index, parent, children, className }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { index, parent },
  });

  return (
    <Card
      className={cn("rounded-xl p-3 shadow-sm cursor-grab", isDragging && "cursor-grabbing opacity-70", className)}
      style={{
        transform: transform ? `translateX(${transform.x}px) translateY(${transform.y}px)` : "none",
      }}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      {children}
    </Card>
  );
};

export type KanbanCardsProps = {
  children: ReactNode;
  className?: string;
};

export const KanbanCards = ({ children, className }: KanbanCardsProps) => (
  <div className={cn("flex flex-1 flex-col gap-2", className)}>{children}</div>
);

export type KanbanHeaderProps = {
  children: ReactNode;
  className?: string;
};

export const KanbanHeader = ({ children, className }: KanbanHeaderProps) => (
  <div className={cn("flex shrink-0 items-center gap-2 px-1 pt-1 pb-2", className)}>{children}</div>
);

export type KanbanProviderProps = {
  children: ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  className?: string;
};

export const KanbanProvider = ({ children, onDragEnd, className }: KanbanProviderProps) => (
  <DndContext collisionDetection={rectIntersection} onDragEnd={onDragEnd}>
    <div className={cn("grid w-full auto-cols-fr grid-flow-col gap-4", className)}>{children}</div>
  </DndContext>
);
