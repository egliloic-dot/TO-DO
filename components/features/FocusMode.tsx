// FocusMode — overlay plein écran qui isole la tâche la plus urgente.
// Aide à ne pas procrastiner en cachant tout le reste de l'interface.

"use client";

import { motion } from "framer-motion";
import { X, Flame, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getTagColor } from "@/lib/tagUtils";
import type { Task } from "@/hooks/useTasks";

const IMPORTANCE_ORDER: Record<Task["importance"], number> = { Urgent: 0, Moyen: 1, Faible: 2 };

const IMPORTANCE_STYLES: Record<Task["importance"], string> = {
  Urgent: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  Moyen:  "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  Faible: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
};

interface FocusModeProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function FocusMode({ tasks, onToggle, onClose }: FocusModeProps) {
  // Tâche la plus urgente parmi les tâches non terminées
  const target = [...tasks]
    .filter((t) => !t.done)
    .sort((a, b) => IMPORTANCE_ORDER[a.importance] - IMPORTANCE_ORDER[b.importance])[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      {/* Bouton fermer */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-6 top-6 text-muted-foreground"
        aria-label="Quitter le mode focus"
      >
        <X className="h-5 w-5" />
      </Button>

      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3, ease: "easeOut" }}
        className="flex w-full max-w-md flex-col items-center gap-8 px-6 text-center"
      >
        {/* Icône + label */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Mode Focus
          </p>
        </div>

        {target ? (
          <>
            {/* Carte de la tâche cible */}
            <div className="w-full rounded-xl border border-border bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-center gap-2">
                {target.importance === "Urgent" && (
                  <Flame className="h-5 w-5 text-red-500" />
                )}
                <h2 className="text-xl font-semibold text-foreground">{target.label}</h2>
              </div>

              {/* Badges */}
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className={IMPORTANCE_STYLES[target.importance]}>
                  {target.importance}
                </Badge>
                {target.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className={`text-xs ${getTagColor(tag)}`}>
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Notes si présentes */}
              {target.notes && (
                <p className="mb-6 text-sm text-muted-foreground">{target.notes}</p>
              )}

              {/* Checkbox */}
              <div className="flex items-center justify-center gap-3">
                <Checkbox
                  id="focus-task"
                  checked={target.done}
                  onCheckedChange={() => onToggle(target.id)}
                  className="h-6 w-6"
                />
                <label htmlFor="focus-task" className="cursor-pointer text-sm text-muted-foreground">
                  Marquer comme terminée
                </label>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Concentrez-vous sur cette seule tâche. Tout le reste peut attendre.
            </p>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">Toutes vos tâches sont terminées !</p>
            <p className="mt-2 text-sm text-muted-foreground">Profitez de votre journée.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
