// Footer — affiche l'heure actuelle (mise à jour chaque minute) et un message de motivation aléatoire.

"use client";

import { useState, useEffect, useRef } from "react";

const MOTIVATIONS = [
  "La productivité, c'est faire des choses importantes, pas beaucoup de choses.",
  "Une tâche commencée est à moitié faite.",
  "Concentrez-vous sur ce qui compte vraiment aujourd'hui.",
  "Chaque petite victoire mérite d'être célébrée.",
  "Progrès, pas perfection.",
  "Le secret : commencer. Le reste suit.",
  "Vos efforts d'aujourd'hui sont les résultats de demain.",
  "Faites d'abord la chose difficile. Le reste devient plus simple.",
];

export function Footer() {
  const [time, setTime] = useState("");
  const motivationRef = useRef(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);

  useEffect(() => {
    function updateTime() {
      setTime(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    }
    updateTime();
    const interval = setInterval(updateTime, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="mt-auto border-t border-border px-8 py-4">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
        <p className="text-xs italic text-muted-foreground/70 max-w-sm">
          &ldquo;{motivationRef.current}&rdquo;
        </p>
        <time className="shrink-0 font-mono text-sm font-medium tabular-nums text-muted-foreground">
          {time}
        </time>
      </div>
    </footer>
  );
}
