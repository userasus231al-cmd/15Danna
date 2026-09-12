import confetti from 'canvas-confetti';

/**
 * Trigger magical fairy dust sparkles when turning a storybook page
 */
export function triggerPageTurnSparkles(direction: 'next' | 'prev' = 'next') {
  try {
    // 1. Central golden and rose sparkle burst (Reduced)
    confetti({
      particleCount: 15,
      angle: direction === 'next' ? 60 : 120,
      spread: 50,
      origin: { x: direction === 'next' ? 0.2 : 0.8, y: 0.55 },
      colors: ['#f472b6', '#fbbf24', '#fbcfe8', '#fef08a', '#ffffff', '#e879f9'],
      shapes: ['star', 'circle'],
      scalar: 0.9,
      ticks: 150,
      gravity: 0.8,
      drift: direction === 'next' ? 0.3 : -0.3,
    });

    // 2. Secondary soft shimmer (Reduced)
    setTimeout(() => {
      confetti({
        particleCount: 10,
        spread: 60,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#ffd1dc', '#ffe4b5', '#ffffff'],
        shapes: ['circle'],
        scalar: 0.7,
        ticks: 100,
        gravity: 0.6,
      });
    }, 120);
  } catch (err) {
    console.warn('Confetti effect unavailable:', err);
  }
}

/**
 * Trigger celebratory royal burst (e.g., on book open or RSVP)
 */
export function triggerRoyalFanfareSparkles() {
  try {
    const colors = ['#f472b6', '#fbbf24', '#ffffff', '#e879f9'];

    // Lighter single burst instead of a long loop
    confetti({
      particleCount: 15,
      angle: 60,
      spread: 45,
      origin: { x: 0, y: 0.7 },
      colors: colors,
      shapes: ['star', 'circle'],
      scalar: 0.9,
    });
    confetti({
      particleCount: 15,
      angle: 120,
      spread: 45,
      origin: { x: 1, y: 0.7 },
      colors: colors,
      shapes: ['star', 'circle'],
      scalar: 0.9,
    });
  } catch {
    // safe fallback
  }
}
