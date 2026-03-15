// dateUtils — fonctions utilitaires pour la gestion et l'affichage des dates d'échéance.

import { format, isToday, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

export type DueDateStatus = "overdue" | "today" | "upcoming" | "none";

/** Calcule le statut d'une date d'échéance par rapport à aujourd'hui. */
export function getDueDateStatus(dueDate?: string): DueDateStatus {
  if (!dueDate) return "none";
  const date = new Date(dueDate);
  if (isToday(date)) return "today";
  if (isBefore(date, startOfDay(new Date()))) return "overdue";
  return "upcoming";
}

/** Formate une date ISO en texte lisible en français (ex: "14 mars 2026"). */
export function formatDueDate(dueDate: string): string {
  return format(new Date(dueDate), "d MMM yyyy", { locale: fr });
}

/** Classes Tailwind du badge de date selon le statut. */
export const DUE_DATE_BADGE_STYLES: Record<DueDateStatus, string> = {
  overdue:  "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  today:    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  upcoming: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  none:     "",
};
