// sound.ts — utilitaire pour jouer un son de succès discret via Web Audio API.
// Aucune dépendance externe, aucun fichier audio requis : le son est généré à la volée.

function playNotes(notes: { freq: number; time: number }[], volume: number) {
  try {
    const ctx = new AudioContext();
    notes.forEach(({ freq, time }) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + time);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.35);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 0.4);
    });
  } catch {
    // Web Audio API non disponible — échec silencieux
  }
}

export function playSuccessChime() {
  playNotes([
    { freq: 880,  time: 0    },
    { freq: 1100, time: 0.12 },
    { freq: 1320, time: 0.24 },
  ], 0.07);
}

// Son distinct pour la complétion d'une catégorie entière — arpège plus long et montant
export function playCategoryCompleteChime() {
  playNotes([
    { freq: 523,  time: 0    },
    { freq: 659,  time: 0.12 },
    { freq: 784,  time: 0.24 },
    { freq: 1047, time: 0.36 },
  ], 0.09);
}
