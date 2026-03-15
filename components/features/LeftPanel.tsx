// LeftPanel — colonne gauche fixe du split-screen.
// Sur desktop : panneau fixe w-72. Sur mobile : bouton hamburger + Sheet latéral.

"use client";

import { useState } from "react";
import { LayoutList, Briefcase, Home as HomeIcon, Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/features/ThemeToggle";
import { ProductivityChart } from "@/components/features/ProductivityChart";
import { AnimatedCounter } from "@/components/features/AnimatedCounter";
import { Search } from "lucide-react";
import type { Task, Category } from "@/hooks/useTasks";

export type CategoryFilter = "all" | Category;

interface LeftPanelProps {
  tasks:            Task[];
  activeCategory:   CategoryFilter;
  onCategoryChange: (v: CategoryFilter) => void;
  search:           string;
  onSearchChange:   (v: string) => void;
}

const CATEGORY_FILTERS: { value: CategoryFilter; label: string; icon: React.ElementType }[] = [
  { value: "all",     label: "Toutes",  icon: LayoutList },
  { value: "Travail", label: "Travail", icon: Briefcase  },
  { value: "Perso",   label: "Perso",   icon: HomeIcon   },
];

function PanelContent({
  tasks, activeCategory, onCategoryChange, search, onSearchChange, onClose,
}: LeftPanelProps & { onClose?: () => void }) {
  const total     = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const active    = total - completed;

  const countForFilter = (f: CategoryFilter) =>
    f === "all" ? total : tasks.filter((t) => t.category === f).length;

  return (
    <div className="flex flex-col gap-0 px-4 py-6 flex-1 overflow-y-auto">

      {/* Logo */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xl font-black tracking-widest text-foreground uppercase">TO DO</span>
        <ThemeToggle />
      </div>

      <Separator className="my-3" />

      {/* Stats compactes */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { label: "Total",     value: total,     color: "text-slate-500"   },
          { label: "Actives",   value: active,    color: "text-blue-500"    },
          { label: "Terminées", value: completed, color: "text-emerald-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg bg-muted/50 p-2 text-center">
            <p className={`text-lg font-bold ${color}`}>
              <AnimatedCounter value={value} />
            </p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <Separator className="my-3" />

      {/* Recherche */}
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher…"
          className="h-8 pl-8 text-sm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Rechercher dans les tâches"
        />
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-col gap-1 mb-2">
        <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Catégories
        </p>
        {CATEGORY_FILTERS.map(({ value, label, icon: Icon }) => {
          const count = countForFilter(value);
          return (
            <button
              key={value}
              onClick={() => { onCategoryChange(value); onClose?.(); }}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                value === activeCategory
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              aria-current={value === activeCategory ? "true" : undefined}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <Separator className="my-3" />

      {/* Graphique de productivité */}
      <ProductivityChart tasks={tasks} />

    </div>
  );
}

export function LeftPanel(props: LeftPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton hamburger — visible uniquement sur mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Ouvrir le menu">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col">
            <PanelContent {...props} onClose={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Panneau fixe — visible uniquement sur desktop */}
      <aside className="hidden md:flex h-screen w-72 flex-shrink-0 flex-col border-r border-border bg-card overflow-y-auto">
        <PanelContent {...props} />
      </aside>
    </>
  );
}
