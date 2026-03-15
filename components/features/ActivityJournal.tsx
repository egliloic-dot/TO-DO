// ActivityJournal — affiche le résumé d'activité et un mini graphique sur 7 jours.
// Calcule les données depuis le champ completedAt des tâches (aucun stockage externe).

"use client";

import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import type { Task } from "@/hooks/useTasks";

interface ActivityJournalProps {
  tasks: Task[];
}

export function ActivityJournal({ tasks }: ActivityJournalProps) {
  const today = new Date().toISOString().slice(0, 10);

  // Tâches terminées aujourd'hui
  const completedToday = tasks.filter((t) => t.completedAt === today).length;

  // Données des 7 derniers jours pour le graphique
  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date  = subDays(new Date(), 6 - i);
      const iso   = date.toISOString().slice(0, 10);
      const count = tasks.filter((t) => t.completedAt === iso).length;
      const label = i === 6 ? "Auj." : format(date, "EEE", { locale: fr });
      return { iso, label, count };
    });
  }, [tasks]);

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Activité
      </p>

      {/* Résumé textuel */}
      <p className="px-2 py-1 text-xs text-foreground">
        {completedToday === 0
          ? "Aucune tâche terminée aujourd'hui."
          : `✓ ${completedToday} tâche${completedToday > 1 ? "s" : ""} terminée${completedToday > 1 ? "s" : ""} aujourd'hui`}
      </p>

      {/* Mini graphique en barres — 7 jours */}
      <div className="mt-2 flex items-end justify-between gap-1 px-2" aria-hidden>
        {chartData.map(({ iso, label, count }) => {
          const heightPct = Math.max((count / maxCount) * 100, count > 0 ? 15 : 4);
          const isToday   = iso === today;
          return (
            <div key={iso} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-sm transition-all duration-500"
                style={{
                  height:          `${heightPct * 0.28}rem`,
                  backgroundColor: isToday
                    ? "hsl(var(--primary))"
                    : count > 0
                      ? "hsl(var(--primary) / 0.35)"
                      : "hsl(var(--muted))",
                }}
                title={`${count} tâche${count !== 1 ? "s" : ""}`}
              />
              <span className={`text-[9px] ${isToday ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
