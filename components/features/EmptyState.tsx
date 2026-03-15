// EmptyState — bloc central affiché quand la liste est vide.
// Message motivant adapté à l'heure de la journée pour la liste vide,
// message de recherche pour l'état "aucun résultat".

"use client";

import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { Sparkles, SearchX, Sun, Coffee, Moon } from "lucide-react";

interface EmptyStateProps {
  isSearch?:   boolean;
  searchQuery?: string;
}

interface TimeSlot {
  icon:    React.ElementType;
  color:   string;
  bg:      string;
  title:   string;
  message: string;
}

function getTimeSlot(): TimeSlot {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return {
    icon:    Sun,
    color:   "text-amber-400",
    bg:      "bg-amber-50 dark:bg-amber-950/40",
    title:   "Prêt pour une journée productive ?",
    message: "Ajoutez votre première tâche et lancez-vous !",
  };
  if (h >= 12 && h < 18) return {
    icon:    Coffee,
    color:   "text-orange-400",
    bg:      "bg-orange-50 dark:bg-orange-950/40",
    title:   "Continuez sur cette lancée !",
    message: "L'après-midi est encore long — que souhaitez-vous accomplir ?",
  };
  return {
    icon:    Moon,
    color:   "text-indigo-400",
    bg:      "bg-indigo-50 dark:bg-indigo-950/40",
    title:   "Bravo pour vos efforts aujourd'hui.",
    message: "Reposez-vous bien, demain sera une nouvelle journée.",
  };
}

const containerVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const iconVariants: Variants = {
  hidden:  { scale: 0.6, opacity: 0 },
  visible: { scale: 1,   opacity: 1 },
};

export function EmptyState({ isSearch, searchQuery }: EmptyStateProps) {
  // Calculé une seule fois au montage pour éviter les changements de slot pendant la session
  const slot = useMemo(() => getTimeSlot(), []);

  if (isSearch) {
    return (
      <motion.div
        key="empty-search"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center justify-center gap-4 py-20 text-center"
      >
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1, duration: 0.3, type: "spring", bounce: 0.4 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800"
        >
          <SearchX className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </motion.div>
        <div>
          <p className="text-base font-semibold text-foreground">
            Aucun résultat pour &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Essayez un autre mot-clé ou vérifiez l&apos;orthographe.
          </p>
        </div>
      </motion.div>
    );
  }

  const { icon: TimeIcon, color, bg, title, message } = slot;

  return (
    <motion.div
      key="empty-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-5 py-20 text-center"
    >
      {/* Icône principale avec halo */}
      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1, duration: 0.4, type: "spring", bounce: 0.45 }}
        className="relative"
      >
        <div className={`flex h-24 w-24 items-center justify-center rounded-3xl ${bg} shadow-sm`}>
          <TimeIcon className={`h-12 w-12 ${color}`} />
        </div>
        {/* Sparkles décoratif */}
        <motion.div
          animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute -right-2 -top-2"
        >
          <Sparkles className="h-5 w-5 text-primary/60" />
        </motion.div>
      </motion.div>

      {/* Texte */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{message}</p>
      </motion.div>
    </motion.div>
  );
}
