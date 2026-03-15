// NotificationBell — icône de cloche avec Popover listant les tâches urgentes et en retard.
// Reçoit la liste complète des tâches et filtre celles qui nécessitent une attention immédiate.

"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { getDueDateStatus, formatDueDate } from "@/lib/dateUtils";
import type { Task } from "@/hooks/useTasks";

interface NotificationBellProps {
  tasks: Task[];
}

export function NotificationBell({ tasks }: NotificationBellProps) {
  // Tâches non terminées en retard ou dont l'échéance est aujourd'hui
  const urgent = tasks.filter((t) => {
    if (t.done || !t.dueDate) return false;
    const status = getDueDateStatus(t.dueDate);
    return status === "overdue" || status === "today";
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications — ${urgent.length} tâche${urgent.length !== 1 ? "s" : ""} urgente${urgent.length !== 1 ? "s" : ""}`}
        >
          <Bell className="h-4 w-4" />
          {urgent.length > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {urgent.length > 0
              ? `${urgent.length} tâche${urgent.length > 1 ? "s" : ""} nécessite${urgent.length > 1 ? "nt" : ""} votre attention`
              : "Aucune tâche urgente"}
          </p>
        </div>

        {urgent.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Vous êtes à jour !</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {urgent.map((task) => {
              const status = getDueDateStatus(task.dueDate);
              return (
                <li key={task.id} className="flex items-start gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {task.label}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          status === "overdue"
                            ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300"
                            : "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300"
                        }`}
                      >
                        {status === "overdue" ? "En retard" : "Aujourd'hui"}
                      </Badge>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          {formatDueDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
