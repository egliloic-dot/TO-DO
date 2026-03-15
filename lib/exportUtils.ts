// exportUtils — fonctions d'export des tâches en CSV et PDF.
// PDF : import dynamique de jsPDF pour éviter tout chargement SSR.
// CSV : génération native, aucune dépendance.

import type { Task } from "@/hooks/useTasks";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// ── CSV ──────────────────────────────────────────────────────────────────────

export function exportToCSV(tasks: Task[]) {
  const headers = ["Tâche", "Catégorie", "Importance", "Statut", "Échéance", "Tags", "Notes", "Créée le"];

  const rows = tasks.map((t) => [
    t.label,
    t.category,
    t.importance,
    t.done ? "Terminée" : "Active",
    t.dueDate ? format(new Date(t.dueDate), "d MMM yyyy", { locale: fr }) : "",
    t.tags.join(", "),
    (t.notes ?? "").replace(/\n/g, " "),
    format(new Date(t.createdAt), "d MMM yyyy", { locale: fr }),
  ]);

  const escape = (cell: string) => `"${String(cell).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");

  // BOM UTF-8 pour que Excel l'ouvre correctement avec les accents
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = `mes-taches-${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ── PDF ──────────────────────────────────────────────────────────────────────

export async function exportToPDF(tasks: Task[]) {
  // Import dynamique → ne charge jsPDF que côté client, à la demande
  const { default: jsPDF }    = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc  = new jsPDF({ orientation: "landscape" });
  const date = format(new Date(), "d MMMM yyyy", { locale: fr });

  // En-tête
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Mes Tâches", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Exporté le ${date} — ${tasks.length} tâche${tasks.length > 1 ? "s" : ""}`, 14, 26);
  doc.setTextColor(0);

  // Tableau
  autoTable(doc, {
    startY: 32,
    head: [["Tâche", "Catégorie", "Importance", "Statut", "Échéance", "Tags"]],
    body: tasks.map((t) => [
      t.label,
      t.category,
      t.importance,
      t.done ? "✓ Terminée" : "En cours",
      t.dueDate ? format(new Date(t.dueDate), "d MMM yyyy", { locale: fr }) : "—",
      t.tags.join(", ") || "—",
    ]),
    headStyles:  { fillColor: [30, 30, 60], fontSize: 9, fontStyle: "bold" },
    bodyStyles:  { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 248, 252] },
    columnStyles: {
      0: { cellWidth: 80 },
      2: { halign: "center" },
      3: { halign: "center" },
    },
  });

  doc.save(`mes-taches-${format(new Date(), "yyyy-MM-dd")}.pdf`);
}
