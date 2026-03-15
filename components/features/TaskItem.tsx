"use client";

// TaskItem — carte minimaliste d'une tâche avec bouton favori animé.

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Flame, ExternalLink, Star } from "lucide-react";
import { getDueDateStatus, formatDueDate, DUE_DATE_BADGE_STYLES } from "@/lib/dateUtils";
import { getTagColor } from "@/lib/tagUtils";
import type { Task } from "@/hooks/useTasks";

const CATEGORY_STYLES: Record<Task["category"], string> = {
  Travail: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  Perso:   "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
};
const IMPORTANCE_STYLES: Record<Task["importance"], string> = {
  Urgent: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  Moyen:  "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  Faible: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
};
const DUE_DATE_LABELS: Record<string, string> = { overdue: "En retard", today: "Aujourd'hui" };

interface TaskItemProps {
  task:          Task;
  onToggle:      (id: string) => void;
  onToggleStar:  (id: string) => void;
  onDelete:      (id: string) => void;
  onOpenDetail:  (id: string) => void;
}

export function TaskItem({ task, onToggle, onToggleStar, onDelete, onOpenDetail }: TaskItemProps) {
  const dueDateStatus = getDueDateStatus(task.dueDate);

  return (
    <motion.div layout layoutId={task.id} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
      <Card className={`transition-all duration-200 hover:shadow-md hover:-translate-y-px hover:border-primary/20 ${
        task.starred ? "border-amber-300/60 dark:border-amber-600/40" : ""
      }`}>
        <CardContent className="flex items-center gap-3 py-3 px-4">

          {/* Favori */}
          <div onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleStar(task.id)}
              aria-label={task.starred ? "Retirer des favoris" : "Ajouter aux favoris"}
              className="flex shrink-0 items-center justify-center rounded p-0.5 transition-colors hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <AnimatePresence mode="wait" initial={false}>
                {task.starred ? (
                  <motion.span
                    key="starred"
                    initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1,   rotate: 0,   opacity: 1 }}
                    exit={{   scale: 0.4, rotate: 20,   opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                    className="block"
                  >
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="unstarred"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1,   opacity: 1 }}
                    exit={{   scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="block"
                  >
                    <Star className="h-3.5 w-3.5 text-muted-foreground/40 hover:text-amber-400" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Checkbox */}
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              id={`task-${task.id}`}
              checked={task.done}
              onCheckedChange={() => onToggle(task.id)}
              aria-label={`Marquer "${task.label}" comme terminée`}
            />
          </div>

          {/* Label */}
          <span
            className={`flex flex-1 items-center gap-1.5 text-sm ${
              task.done ? "text-muted-foreground line-through" : "text-foreground"
            }`}
          >
            {task.importance === "Urgent" && !task.done && (
              <Flame className="h-3.5 w-3.5 shrink-0 text-red-500" aria-label="Urgent" />
            )}
            {task.label}
          </span>

          {/* Badges */}
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {task.dueDate && (
              <Badge variant="outline" className={`text-xs font-medium ${DUE_DATE_BADGE_STYLES[dueDateStatus]}`}>
                {DUE_DATE_LABELS[dueDateStatus] ?? formatDueDate(task.dueDate)}
              </Badge>
            )}
            <Badge variant="outline" className={`text-xs font-medium ${IMPORTANCE_STYLES[task.importance]}`}>
              {task.importance}
            </Badge>
            <Badge variant="outline" className={`text-xs font-medium ${CATEGORY_STYLES[task.category]}`}>
              {task.category}
            </Badge>
            {task.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className={`text-xs font-medium ${getTagColor(tag)}`}>
                {tag}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{task.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost" size="icon"
              onClick={() => onOpenDetail(task.id)}
              aria-label="Voir les détails"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => onDelete(task.id)}
              aria-label={`Supprimer "${task.label}"`}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}
