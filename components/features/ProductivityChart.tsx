// ProductivityChart — graphique en barres des tâches terminées sur les 7 derniers jours.
// Utilise Recharts avec des couleurs adaptées au thème clair/sombre via CSS variables.

"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { subDays, format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useTheme } from "next-themes";
import type { Task } from "@/hooks/useTasks";

interface ProductivityChartProps {
  tasks: Task[];
}

// Tooltip personnalisé sobre
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground">{payload[0].value} tâche{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

export function ProductivityChart({ tasks }: ProductivityChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const today = new Date();

  const data = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const date  = subDays(today, 6 - i);
      const iso   = date.toISOString().slice(0, 10);
      const count = tasks.filter((t) => t.completedAt === iso).length;
      const isToday = isSameDay(date, today);
      return {
        label: isToday ? "Auj." : format(date, "EEE", { locale: fr }),
        count,
        isToday,
      };
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [tasks]);

  const completedToday = data.find((d) => d.isToday)?.count ?? 0;

  const barColor       = isDark ? "#818cf8" : "#6366f1"; // indigo
  const barColorToday  = isDark ? "#a5b4fc" : "#4f46e5"; // indigo plus foncé
  const axisColor      = isDark ? "#64748b" : "#94a3b8"; // slate-500

  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Productivité
      </p>
      <p className="mb-3 px-2 text-xs text-foreground">
        {completedToday === 0
          ? "Aucune tâche terminée aujourd'hui."
          : `✓ ${completedToday} tâche${completedToday > 1 ? "s" : ""} terminée${completedToday > 1 ? "s" : ""} aujourd'hui`}
      </p>

      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={data} margin={{ top: 0, right: 4, left: -28, bottom: 0 }} barCategoryGap="25%">
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: axisColor }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 9, fill: axisColor }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }} />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.isToday ? barColorToday : barColor} fillOpacity={entry.isToday ? 1 : 0.55} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
