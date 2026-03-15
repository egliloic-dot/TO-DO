// StatsBar — barre de statistiques affichant 3 métriques clés sur les tâches.
// Les chiffres s'animent avec AnimatedCounter à chaque changement de valeur.

import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/features/AnimatedCounter";
import { ListTodo, CircleDot, CircleCheck } from "lucide-react";

interface StatsBarProps {
  total: number;
  active: number;
  completed: number;
}

const STATS = (props: StatsBarProps) => [
  {
    label: "Total",
    value: props.total,
    icon: ListTodo,
    color: "text-slate-500",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
  {
    label: "En cours",
    value: props.active,
    icon: CircleDot,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  {
    label: "Terminées",
    value: props.completed,
    icon: CircleCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950",
  },
];

export function StatsBar({ total, active, completed }: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {STATS({ total, active, completed }).map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-4 py-4 px-5">
            <div className={`rounded-lg p-2 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedCounter value={value} />
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
