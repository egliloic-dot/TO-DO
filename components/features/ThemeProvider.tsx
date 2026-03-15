// ThemeProvider — enveloppe l'application avec next-themes pour le support dark/light mode.
// Doit être placé dans le layout racine, en dehors des Server Components.

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
