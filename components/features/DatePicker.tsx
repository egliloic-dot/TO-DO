// DatePicker — champ de sélection de date via un calendrier en Popover.
// Reçoit une valeur ISO et retourne une valeur ISO au parent via onSelect.

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
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          locale={fr}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
