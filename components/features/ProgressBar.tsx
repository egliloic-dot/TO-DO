// ProgressBar — affiche la progression des tâches terminées dans la vue active.
// Utilise le composant shadcn Progress et anime la valeur avec Framer Motion.

"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  total: number;
  completed: number;
}

export function ProgressBar({ total, completed }: ProgressBarProps) {
  if (total === 0) return null;

  const pct = Math.round((completed / total) * 100);

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Progress value={pct} className="h-2" />
      </div>
      <motion.span
        key={pct}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-52 shrink-0 text-xs text-muted-foreground"
      >
        {pct === 100
          ? "🎉 Tous vos objectifs sont atteints !"
          : `${pct}% de vos objectifs atteints`}
      </motion.span>
    </div>
  );
}
