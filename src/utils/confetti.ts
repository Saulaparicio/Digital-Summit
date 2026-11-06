import confetti from 'canvas-confetti';

/**
 * Trigger celebration confetti with authentic Digital Creator Summit PNM26 / OneVoice27 color palette
 */
export const triggerSummitConfetti = () => {
  // Summit palette colors
  const colors = ['#E01E7E', '#00D5D8', '#007D80', '#FFB703', '#FFFFFF', '#9333EA'];

  // Left burst
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
    colors,
    shapes: ['square', 'circle'],
    ticks: 250,
  });

  // Right burst
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 },
    colors,
    shapes: ['square', 'circle'],
    ticks: 250,
  });

  // Center star burst
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors,
      shapes: ['star', 'circle'],
      scalar: 1.2,
      ticks: 300,
    });
  }, 180);
};
