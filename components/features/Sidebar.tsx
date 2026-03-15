// Sidebar — navigation latérale avec profil utilisateur, theme toggle et journal d'activité.

import { CheckSquare, Inbox, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/features/ThemeToggle";
import { ActivityJournal } from "@/components/features/ActivityJournal";
import type { Task } from "@/hooks/useTasks";

export type AppView = "inbox" | "calendar";

const NAV_ITEMS: { icon: React.ElementType; label: string; view: AppView }[] = [
  { icon: Inbox,    label: "Inbox",      view: "inbox"    },
  { icon: Calendar, label: "Calendrier", view: "calendar" },
];

interface SidebarProps {
  view: AppView;
  onViewChange: (view: AppView) => void;
  tasks: Task[];
}

export function Sidebar({ view, onViewChange, tasks }: SidebarProps) {
  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-border bg-card px-3 py-6">

      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-2">
        <CheckSquare className="h-5 w-5 text-primary" />
        <span className="text-base font-semibold tracking-tight text-foreground">
          Mes Tâches
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1" aria-label="Navigation principale">
        {NAV_ITEMS.map(({ icon: Icon, label, view: navView }) => (
          <button
            key={label}
            onClick={() => onViewChange(navView)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              navView === view
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
            aria-current={navView === view ? "page" : undefined}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      {/* Journal d'activité */}
      <ActivityJournal tasks={tasks} />

      <div className="flex-1" />

      {/* Toggle Dark Mode */}
      <div className="mb-4 flex justify-center">
        <ThemeToggle />
      </div>

      {/* Profil utilisateur */}
      <div className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent transition-colors">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="Avatar de Loïc Egli" />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            LE
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate">Loïc Egli</span>
          <span className="text-xs text-muted-foreground truncate">Pro</span>
        </div>
      </div>

    </aside>
  );
}
