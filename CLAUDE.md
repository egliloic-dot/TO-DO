# CLAUDE.md - Projet To-Do List Ergonomique

## Vision du Projet
Une application de gestion de tâches haut de gamme, ultra-ergonomique, avec gestion de priorités par codes couleurs, vues calendrier et futures intégrations API (Google/Outlook). L'accent est mis sur la réduction de la friction utilisateur.

## Stack Technique
- **Framework :** Next.js 14 (App Router)
- **Langage :** TypeScript (Mode Strict)
- **Base de données :** Prisma + PostgreSQL (via Supabase ou local)
- **Stylisation :** Tailwind CSS + Framer Motion (pour les animations)
- **Composants UI :** shadcn/ui (Radix UI)
- **Icônes :** Lucide React

## Commandes Importantes
- `npm run dev` → Lancer le serveur de développement
- `npx prisma generate` → Mettre à jour le client Prisma après modif du schéma
- `npx prisma migrate dev` → Créer une migration de base de données
- `npx prisma studio` → Interface visuelle pour voir tes tâches en BDD
- `npx shadcn-ui@latest add [component]` → Ajouter un nouveau composant UI

## Conventions de Code & Architecture
- **Composants :** Diviser en `/components/ui` (atomiques) et `/components/features` (logique métier).
- **Types :** Définir des interfaces TypeScript claires pour les Tâches (`Task`), les Projets (`Project`) et les Priorités.
- **Gestion d'état :** Utiliser React Server Components par défaut, et `use client` uniquement quand nécessaire.
- **Commentaires :** Chaque nouveau fichier doit commencer par un commentaire expliquant son rôle technique pour faciliter ma compréhension.
- **Couleurs :** Utiliser les variables de thèmes Tailwind (ex: `bg-priority-high`, `text-sidebar-active`).

## Structure du Projet
- `/app` → Routes et Layouts (Inbox, Aujourd'hui, Calendrier)
- `/components` → Éléments visuels réutilisables
- `/lib` → Fonctions utilitaires, config Prisma, logique de tri
- `/hooks` → Logique réutilisable (ex: `useTasks`)
- `/prisma` → Schéma de la base de données

## Règles de Développement (Anti-Vibe Coding)
- **Étape par étape :** Ne jamais coder plus d'une fonctionnalité à la fois.
- **Explications :** Après chaque modification majeure, résumer ce qui a été fait et pourquoi ce choix technique a été pris.
- **Validation :** Me demander confirmation avant d'installer une nouvelle bibliothèque importante.
- **Accessibilité :** Toujours respecter les normes ARIA pour que l'app soit utilisable au clavier.

## Ce qu'il ne faut PAS faire
- Ne pas coder de logique complexe directement dans les fichiers de page (`page.tsx`).
- Ne pas oublier de gérer les états de chargement (Skeletons) et d'erreur.
- Ne pas supprimer de commentaires explicatifs sans raison.