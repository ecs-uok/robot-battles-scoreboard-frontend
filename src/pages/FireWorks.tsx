import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface FireworksProps {
  fire: boolean;
}

const FireWorks: React.FC<FireworksProps> = ({ fire }) => {
  useEffect(() => {
    let interval: number | undefined; // Use number | undefined instead

    if (fire) {
      const duration = 15 * 1000; // 15 seconds
      const animationEnd = Date.now() + duration;

      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1200 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      interval = window.setInterval(() => { // Use window.setInterval
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }

    // Clear the interval when `fire` is set to false or when component unmounts
    return () => clearInterval(interval);
  }, [fire]);

  return null; // Changed from returning an empty string to null for better readability
};

export default FireWorks;
