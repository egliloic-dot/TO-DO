"use client";

// Page principale — layout split-screen avec modale de détails, export et recherche globale.

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useTasks, type Category, type Importance, type Task } from "@/hooks/useTasks";
import { LeftPanel, type CategoryFilter } from "@/components/features/LeftPanel";
import { ProgressBar } from "@/components/features/ProgressBar";
import { SortableTaskItem } from "@/components/features/SortableTaskItem";
import { DatePicker } from "@/components/features/DatePicker";
import { EmptyState } from "@/components/features/EmptyState";
import { NotificationBell } from "@/components/features/NotificationBell";
import { Confetti } from "@/components/features/Confetti";
import { FocusMode } from "@/components/features/FocusMode";
import { Footer } from "@/components/features/Footer";
import { TaskDetailDialog } from "@/components/features/TaskDetailDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Target, Download, FileText, FileSpreadsheet, X, ArchiveX } from "lucide-react";
import { getTagColor } from "@/lib/tagUtils";
import { playSuccessChime, playCategoryCompleteChime } from "@/lib/sound";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";

const CATEGORIES: Category[]   = ["Travail", "Perso"];
const IMPORTANCES: Importance[] = ["Faible", "Moyen", "Urgent"];

/** Recherche globale : filtre par titre, tags, catégorie et importance simultanément. */
function matchesSearch(task: Task, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    task.label.toLowerCase().includes(q) ||
    task.tags.some((t) => t.toLowerCase().includes(q)) ||
    task.category.toLowerCase().includes(q) ||
    task.importance.toLowerCase().includes(q)
  );
}

export default function Home() {
  const {
    tasks, isLoaded, addTask, toggleTask, toggleStar, deleteTask, clearAllTasks, clearCompleted,
    updateTaskLabel, updateNotes, updateTaskTags, updateImportance, updateDueDate,
    addSubtask, toggleSubtask,
    reorderTasks,
  } = useTasks();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [search, setSearch]           = useState("");

  const [inputValue, setInputValue]   = useState("");
  const [category, setCategory]       = useState<Category>("Perso");
  const [importance, setImportance]   = useState<Importance>("Moyen");
  const [dueDate, setDueDate]         = useState<string | undefined>();
  const [formTags, setFormTags]       = useState<string[]>([]);
  const [tagInput, setTagInput]       = useState("");

  const [showConfetti, setShowConfetti] = useState(false);
  const [focusMode, setFocusMode]       = useState(false);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  const taskInputRef     = useRef<HTMLInputElement>(null);
  const prevActiveRef    = useRef<number | null>(null);
  const prevCatActiveRef = useRef<number | null>(null);

  const completed = tasks.filter((t) => t.done).length;
  const active    = tasks.length - completed;

  const categoryTasks  = activeCategory === "all" ? tasks : tasks.filter((t) => t.category === activeCategory);
  const categoryActive = categoryTasks.filter((t) => !t.done).length;

  useEffect(() => {
    if (prevActiveRef.current !== null && prevActiveRef.current > 0 && active === 0 && tasks.length > 0) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(t);
    }
    prevActiveRef.current = active;
  }, [active, tasks.length]);

  useEffect(() => {
    if (
      activeCategory !== "all" &&
      prevCatActiveRef.current !== null &&
      prevCatActiveRef.current > 0 &&
      categoryActive === 0 &&
      categoryTasks.length > 0
    ) {
      playCategoryCompleteChime();
    }
    prevCatActiveRef.current = categoryActive;
  }, [categoryActive, categoryTasks.length, activeCategory]);

  const handleGlobalKey = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || e.metaKey || e.ctrlKey) return;
    if (e.key === "n" || e.key === "N") { e.preventDefault(); taskInputRef.current?.focus(); }
    if (e.key === "Escape" && focusMode) setFocusMode(false);
  }, [focusMode]);

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, [handleGlobalKey]);

  function handleToggle(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.done) playSuccessChime();
    toggleTask(id);
  }

  const filteredTasks     = tasks
    .filter((t) => activeCategory === "all" || t.category === activeCategory)
    .filter((t) => matchesSearch(t, search))
    // Favoris toujours en tête, stable sort (les non-favoris conservent leur ordre)
    .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  const filteredCompleted = filteredTasks.filter((t) => t.done).length;
  const isSearchEmpty     = search.trim().length > 0 && filteredTasks.length === 0;
  const isListEmpty       = search.trim().length === 0 && filteredTasks.length === 0;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active: da, over } = event;
    if (!over || da.id === over.id) return;
    reorderTasks(arrayMove(tasks, tasks.findIndex((t) => t.id === da.id), tasks.findIndex((t) => t.id === over.id)));
  }

  function addFormTag() {
    const trimmed = tagInput.trim();
    if (!trimmed || formTags.includes(trimmed)) return;
    setFormTags((p) => [...p, trimmed]);
    setTagInput("");
  }

  function handleAdd() {
    addTask(inputValue, category, importance, dueDate, formTags);
    setInputValue("");
    setDueDate(undefined);
    setFormTags([]);
  }

  const detailTask = detailTaskId ? tasks.find((t) => t.id === detailTaskId) ?? null : null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">

      {showConfetti && <Confetti />}

      <AnimatePresence>
        {focusMode && <FocusMode tasks={tasks} onToggle={handleToggle} onClose={() => setFocusMode(false)} />}
      </AnimatePresence>

      <TaskDetailDialog
        task={detailTask}
        open={!!detailTaskId}
        onClose={() => setDetailTaskId(null)}
        onToggle={handleToggle}
        onUpdateLabel={updateTaskLabel}
        onUpdateNotes={updateNotes}
        onUpdateTags={updateTaskTags}
        onUpdateImportance={updateImportance}
        onUpdateDueDate={updateDueDate}
        onAddSubtask={addSubtask}
        onToggleSubtask={toggleSubtask}
      />

      <LeftPanel
        tasks={tasks}
        activeCategory={activeCategory} onCategoryChange={setActiveCategory}
        search={search}               onSearchChange={setSearch}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl px-6 pt-16 pb-8 md:pt-8 flex flex-col gap-6">

            {/* En-tête */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Inbox</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Appuyez sur{" "}
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">N</kbd>{" "}
                  pour ajouter · recherche par titre, tag ou catégorie
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      Exporter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => exportToCSV(tasks)} className="gap-2 cursor-pointer">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      Télécharger en CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportToPDF(tasks)} className="gap-2 cursor-pointer">
                      <FileText className="h-4 w-4 text-red-500" />
                      Télécharger en PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant={focusMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFocusMode((v) => !v)}
                  className="gap-1.5"
                >
                  <Target className="h-3.5 w-3.5" />
                  Focus
                </Button>
                <NotificationBell tasks={tasks} />
              </div>
            </div>

            {/* Formulaire d'ajout */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 shadow-sm">
              <div className="flex gap-2">
                <Input
                  ref={taskInputRef}
                  placeholder="Nouvelle tâche… (N)"
                  className="flex-1 border-0 shadow-none bg-transparent px-0 text-sm font-medium placeholder:font-normal focus-visible:ring-0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
                  aria-label="Saisir une nouvelle tâche"
                />
                <Button onClick={handleAdd} size="sm">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger className="h-7 w-28 text-xs" aria-label="Catégorie">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={importance} onValueChange={(v) => setImportance(v as Importance)}>
                  <SelectTrigger className="h-7 w-28 text-xs" aria-label="Importance">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMPORTANCES.map((i) => <SelectItem key={i} value={i} className="text-xs">{i}</SelectItem>)}
                  </SelectContent>
                </Select>
                <DatePicker value={dueDate} onSelect={setDueDate} />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {formTags.map((tag) => (
                    <Badge key={tag} variant="outline" className={`gap-1 text-xs ${getTagColor(tag)}`}>
                      {tag}
                      <button onClick={() => setFormTags((p) => p.filter((t) => t !== tag))} aria-label={`Retirer ${tag}`}>
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                  <Input
                    placeholder="+ Tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFormTag(); } }}
                    onBlur={addFormTag}
                    className="h-7 w-20 text-xs"
                  />
                </div>
              </div>
            </div>

            <ProgressBar total={filteredTasks.length} completed={filteredCompleted} />

            {/* Archiver les tâches terminées */}
            <AnimatePresence>
              {isLoaded && filteredCompleted > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-end overflow-hidden"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCompleted}
                    className="gap-1.5 text-muted-foreground hover:text-foreground text-xs"
                  >
                    <ArchiveX className="h-3.5 w-3.5" />
                    Archiver les terminées ({filteredCompleted})
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skeleton de chargement initial */}
            {!isLoaded && (
              <ul className="flex flex-col gap-2.5">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 flex-1 rounded" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Liste avec drag & drop */}
            {isLoaded && (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <ul className="flex flex-col gap-2.5">
                    <AnimatePresence initial={false}>
                      {filteredTasks.map((task) => (
                        <SortableTaskItem
                          key={task.id}
                          task={task}
                          onToggle={handleToggle}
                          onToggleStar={toggleStar}
                          onDelete={deleteTask}
                          onOpenDetail={setDetailTaskId}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                </SortableContext>
              </DndContext>
            )}

            <AnimatePresence>
              {isLoaded && (isListEmpty || isSearchEmpty) && (
                <EmptyState isSearch={isSearchEmpty} searchQuery={search} />
              )}
            </AnimatePresence>

            {isLoaded && tasks.length > 0 && (
              <div className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-muted-foreground hover:text-destructive hover:border-destructive">
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Tout supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer toutes les tâches ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Les {tasks.length} tâche{tasks.length > 1 ? "s" : ""} seront définitivement supprimée{tasks.length > 1 ? "s" : ""}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={clearAllTasks} className="bg-destructive text-white hover:bg-destructive/90">
                        Tout supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
