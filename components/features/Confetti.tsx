// Confetti — explosion de particules colorées animées avec Framer Motion.
// Monté en overlay plein écran lors de la complétion de toutes les tâches, puis démonté.

"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#c084fc", "#f472b6"];
const PARTICLE_COUNT = 60;

interface Particle {
  id: number;
  x: number;       // position horizontale (vw %)
  color: string;
  size: number;    // px
  delay: number;   // s
  duration: number;// s
  rotate: number;  // deg total
  targetY: number; // translation verticale finale (vh %)
}

export function Confetti() {
  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id:       i,
      x:        5 + Math.random() * 90,
      color:    COLORS[i % COLORS.length],
      size:     6 + Math.random() * 10,
      delay:    Math.random() * 0.4,
      duration: 1.2 + Math.random() * 0.8,
      rotate:   Math.random() * 720 - 360,
      targetY:  40 + Math.random() * 50,
    })),
  []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position:        "absolute",
            left:            `${p.x}%`,
            top:             "0%",
            width:           p.size,
            height:          p.size,
            borderRadius:    Math.random() > 0.5 ? "50%" : "2px",
            backgroundColor: p.color,
          }}
          initial={{ y: "-10vh", opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            y:       `${p.targetY}vh`,
            opacity: [1, 1, 0],
            rotate:  p.rotate,
            scale:   [1, 1, 0.4],
          }}
          transition={{
            duration: p.duration,
            delay:    p.delay,
            ease:     "easeIn",
          }}
        />
      ))}
    </div>
  );
}
