// AnimatedCounter — affiche un nombre avec une animation de défilement à chaque changement.
// Utilise useMotionValue + useTransform de Framer Motion pour interpoler la valeur.

"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
}

export function AnimatedCounter({ value }: AnimatedCounterProps) {
  const motionValue = useMotionValue(value);
  // Arrondi à l'entier le plus proche pour afficher uniquement des nombres entiers
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const prevValue = useRef(value);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.5,
      ease: "easeOut",
      from: prevValue.current,
    });
    prevValue.current = value;
    return controls.stop;
  }, [value, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}
