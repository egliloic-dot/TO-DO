// SortableTaskItem — wrapper dnd-kit autour de TaskItem.

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TaskItem } from "@/components/features/TaskItem";
import type { Task } from "@/hooks/useTasks";

interface SortableTaskItemProps {
  task:         Task;
  onToggle:     (id: string) => void;
  onToggleStar: (id: string) => void;
  onDelete:     (id: string) => void;
  onOpenDetail: (id: string) => void;
}

export function SortableTaskItem(props: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.task.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 50 : undefined }}
      className="flex items-center gap-2"
    >
      <button
        {...attributes} {...listeners}
        className="shrink-0 cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
        aria-label="Réorganiser"
        tabIndex={-1}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <TaskItem {...props} />
      </div>
    </div>
  );
}
