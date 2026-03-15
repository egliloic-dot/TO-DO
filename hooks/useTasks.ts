"use client";

import { useState, useEffect } from "react";

export type Category   = "Travail" | "Perso";
export type Importance = "Faible" | "Moyen" | "Urgent";

export interface Subtask {
  id: string;
  label: string;
  done: boolean;
}

export interface Task {
  id: string;
  label: string;
  done: boolean;
  starred: boolean;
  category: Category;
  importance: Importance;
  dueDate?: string;   // ISO "yyyy-MM-dd"
  notes?: string;
  subtasks: Subtask[];
  tags: string[];
  completedAt?: string;
  createdAt: string;
}

const STORAGE_KEY = "ma-todo-app:tasks";

const PRIORITY_MIGRATION: Record<string, Importance> = {
  Haute: "Urgent", Moyenne: "Moyen", Basse: "Faible",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateDueDate(raw: any): string | undefined {
  if (!raw) return undefined;
  if (typeof raw === "object" && raw.from) return String(raw.from);
  if (typeof raw === "string") return raw;
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateTask(raw: any): Task {
  return {
    id:          raw.id,
    label:       raw.label,
    done:        raw.done ?? false,
    starred:     raw.starred ?? false,
    category:    raw.category === "Important" ? "Travail" : (raw.category ?? "Perso"),
    importance:  raw.importance ?? PRIORITY_MIGRATION[raw.priority] ?? "Moyen",
    dueDate:     migrateDueDate(raw.dueDate),
    notes:       raw.notes ?? "",
    subtasks:    raw.subtasks ?? [],
    tags:        raw.tags ?? [],
    completedAt: raw.completedAt,
    createdAt:   raw.createdAt ?? new Date().toISOString(),
  };
}

export function useTasks() {
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks((JSON.parse(raw) as unknown[]).map(migrateTask));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  function addTask(label: string, category: Category, importance: Importance, dueDate?: string, tags: string[] = []) {
    const trimmed = label.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: trimmed, done: false, starred: false, category, importance, dueDate, notes: "", subtasks: [], tags, completedAt: undefined, createdAt: new Date().toISOString() },
    ]);
  }

  function toggleTask(id: string) {
    const today = new Date().toISOString().slice(0, 10);
    setTasks((prev) =>
      prev.map((t) => t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? today : undefined } : t),
    );
  }

  function toggleStar(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, starred: !t.starred } : t));
  }

  function deleteTask(id: string)     { setTasks((prev) => prev.filter((t) => t.id !== id)); }
  function clearAllTasks()            { setTasks([]); }
  function clearCompleted()           { setTasks((prev) => prev.filter((t) => !t.done)); }
  function reorderTasks(next: Task[]) { setTasks(next); }

  function updateTaskLabel(id: string, label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, label: trimmed } : t));
  }
  function updateNotes(id: string, notes: string)               { setTasks((prev) => prev.map((t) => t.id === id ? { ...t, notes } : t)); }
  function updateTaskTags(id: string, tags: string[])           { setTasks((prev) => prev.map((t) => t.id === id ? { ...t, tags } : t)); }
  function updateImportance(id: string, importance: Importance) { setTasks((prev) => prev.map((t) => t.id === id ? { ...t, importance } : t)); }
  function updateDueDate(id: string, dueDate?: string)          { setTasks((prev) => prev.map((t) => t.id === id ? { ...t, dueDate } : t)); }

  function addSubtask(taskId: string, label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: crypto.randomUUID(), label: trimmed, done: false }] } : t,
    ));
  }
  function toggleSubtask(taskId: string, subtaskId: string) {
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, subtasks: t.subtasks.map((s) => s.id === subtaskId ? { ...s, done: !s.done } : s) } : t,
    ));
  }

  return {
    tasks, isLoaded,
    addTask, toggleTask, toggleStar, deleteTask, clearAllTasks, clearCompleted,
    updateTaskLabel, updateNotes, updateTaskTags, updateImportance, updateDueDate,
    addSubtask, toggleSubtask, reorderTasks,
  };
}
