// DatePicker — champ de sélection de date via un calendrier en Popover.
// Calendrier grand format : cellules 3.5rem, typo agrandie, padding généreux.

"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?:   string;   // "yyyy-MM-dd"
  onSelect: (date?: string) => void;
}

export function DatePicker({ value, onSelect }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value) : undefined;

  function handleSelect(date?: Date) {
    onSelect(date ? format(date, "yyyy-MM-dd") : undefined);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-36 justify-start gap-2 bg-white font-normal text-muted-foreground dark:bg-slate-900"
          aria-label="Choisir une date d'échéance"
        >
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs">
            {selected ? format(selected, "d MMM yyyy", { locale: fr }) : "Échéance…"}
          </span>
        </Button>
      </PopoverTrigger>

      {/* Popover large et éléganr — pas de p-0 pour garder le fond de carte */}
      <PopoverContent
        className="w-auto p-0 overflow-hidden rounded-2xl border border-border shadow-2xl"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          locale={fr}
          initialFocus
          // Cellules 3.5rem (56px) au lieu de 2rem — surcharge tailwind-merge
          className="[--cell-size:3.5rem] p-6"
          classNames={{
            // Mois + année
            caption_label: "select-none text-lg font-semibold text-foreground",
            // En-tête du mois centré avec espace pour les boutons de navigation
            month_caption: "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
            // Noms des jours de la semaine — gap pour aligner avec les cellules
            weekdays: "flex gap-3",
            weekday: "text-muted-foreground flex-1 select-none text-sm font-medium text-center",
            // Rangées de jours avec espacement
            week: "mt-2 flex w-full gap-3",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
