// TaskDetailDialog — modale shadcn Dialog affichant et permettant d'éditer tous les détails d'une tâche.
// S'ouvre quand l'utilisateur clique sur l'icône d'expansion d'une tâche.

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/features/DatePicker";
import { Flame, Tag, Plus, X, CalendarDays, Clock } from "lucide-react";
import { getTagColor } from "@/lib/tagUtils";
import type { Task, Importance } from "@/hooks/useTasks";

const IMPORTANCES: Importance[] = ["Faible", "Moyen", "Urgent"];

const IMPORTANCE_STYLES: Record<Importance, string> = {
  Urgent: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  Moyen:  "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  Faible: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
};

interface TaskDetailDialogProps {
  task:             Task | null;
  open:             boolean;
  onClose:          () => void;
  onToggle:         (id: string) => void;
  onUpdateLabel:    (id: string, label: string) => void;
  onUpdateNotes:    (id: string, notes: string) => void;
  onUpdateTags:     (id: string, tags: string[]) => void;
  onUpdateImportance: (id: string, importance: Importance) => void;
  onUpdateDueDate:  (id: string, dueDate?: string) => void;
  onAddSubtask:     (taskId: string, label: string) => void;
  onToggleSubtask:  (taskId: string, subtaskId: string) => void;
}

export function TaskDetailDialog({
  task, open, onClose,
  onToggle, onUpdateLabel, onUpdateNotes, onUpdateTags,
  onUpdateImportance, onUpdateDueDate,
  onAddSubtask, onToggleSubtask,
}: TaskDetailDialogProps) {
  const [tagInput, setTagInput]         = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");

  if (!task) return null;

  const createdAt = format(new Date(task.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr });
  const subtasksDone = task.subtasks.filter((s) => s.done).length;

  function addTag() {
    const trimmed = tagInput.trim();
    if (!trimmed || task!.tags.includes(trimmed)) return;
    onUpdateTags(task!.id, [...task!.tags, trimmed]);
    setTagInput("");
  }
  function removeTag(tag: string) { onUpdateTags(task!.id, task!.tags.filter((t) => t !== tag)); }

  function handleAddSubtask() {
    onAddSubtask(task!.id, subtaskInput);
    setSubtaskInput("");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8">
            {task.importance === "Urgent" && !task.done && (
              <Flame className="h-4 w-4 shrink-0 text-red-500" />
            )}
            <input
              defaultValue={task.label}
              onBlur={(e) => onUpdateLabel(task.id, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
              className="w-full bg-transparent text-base font-semibold outline-none focus:border-b focus:border-primary"
              aria-label="Titre de la tâche"
            />
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Créée le {createdAt}
            </span>
            {task.completedAt && (
              <span className="flex items-center gap-1 text-emerald-600">
                <CalendarDays className="h-3 w-3" />
                Terminée le {format(new Date(task.completedAt), "d MMM yyyy", { locale: fr })}
              </span>
            )}
          </div>

          {/* Statut */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="dialog-done"
              checked={task.done}
              onCheckedChange={() => onToggle(task.id)}
            />
            <label htmlFor="dialog-done" className="cursor-pointer text-sm text-muted-foreground">
              {task.done ? "Tâche terminée" : "Marquer comme terminée"}
            </label>
          </div>

          <Separator />

          {/* Importance + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Importance</p>
              <Select value={task.importance} onValueChange={(v) => onUpdateImportance(task.id, v as Importance)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMPORTANCES.map((imp) => (
                    <SelectItem key={imp} value={imp} className="text-xs">
                      <span className={`mr-2 inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${IMPORTANCE_STYLES[imp]}`}>
                        {imp}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Échéance</p>
              <DatePicker value={task.dueDate} onSelect={(d) => onUpdateDueDate(task.id, d)} />
            </div>
          </div>

          {/* Badges actuels */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={`text-xs ${IMPORTANCE_STYLES[task.importance]}`}>
              {task.importance}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {task.category}
            </Badge>
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Notes & Description</p>
            <Textarea
              placeholder="Ajoutez des notes, contexte, liens…"
              value={task.notes ?? ""}
              onChange={(e) => onUpdateNotes(task.id, e.target.value)}
              className="min-h-[100px] resize-y text-sm"
            />
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <p className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Tag className="h-3 w-3" /> Tags personnalisés
            </p>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span key={tag} className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getTagColor(tag)}`}>
                  {tag}
                  <button onClick={() => removeTag(tag)} aria-label={`Supprimer ${tag}`}>
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Nouveau tag…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                className="h-7 text-xs"
              />
              <Button size="sm" variant="outline" onClick={addTag} className="h-7 px-2">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Sous-tâches */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Sous-tâches
              {task.subtasks.length > 0 && (
                <span className="ml-1 font-normal text-muted-foreground/60">
                  ({subtasksDone}/{task.subtasks.length} terminée{subtasksDone > 1 ? "s" : ""})
                </span>
              )}
            </p>
            <ul className="mb-3 flex flex-col gap-2">
              {task.subtasks.map((sub) => (
                <li key={sub.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`dialog-sub-${sub.id}`}
                    checked={sub.done}
                    onCheckedChange={() => onToggleSubtask(task.id, sub.id)}
                  />
                  <label
                    htmlFor={`dialog-sub-${sub.id}`}
                    className={`flex-1 cursor-pointer text-sm ${sub.done ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {sub.label}
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter une sous-tâche…"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSubtask(); } }}
                className="h-8 text-sm"
              />
              <Button size="sm" variant="outline" onClick={handleAddSubtask} className="h-8 px-3">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
