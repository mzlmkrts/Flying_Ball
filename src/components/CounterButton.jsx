import React, { useState, useEffect, useRef, useCallback } from 'react';

const CANDIDATE_COUNT = 8;
const PICK_FROM_TOP = 5;

export function CounterButton() {
  const flyButtonRef = useRef(null);
  const moveButtonRef = useRef(null);
  const lastPositionRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [count, setCount] = useState(0);
  const [intervalDuration, setIntervalDuration] = useState(2000);

  const moveToNewPosition = useCallback((instant = false) => {
    const flyButton = flyButtonRef.current;
    if (!flyButton) return;

    const { width, height } = windowSize;
    const buttonWidth = flyButton.offsetWidth || 100;
    const buttonHeight = flyButton.offsetHeight || 100;
    const margin = width < 600 ? 16 : 8;
    const maxX = Math.max(0, width - buttonWidth - margin * 2);
    const maxY = Math.max(0, height - buttonHeight - margin * 2);

    // Generate candidates and pick from the 5 longest paths (avoids short jittery moves when interval is fast)
    const candidates = Array.from({ length: CANDIDATE_COUNT }, () => ({
      x: margin + Math.random() * maxX,
      y: margin + Math.random() * maxY,
    }));

    const current = lastPositionRef.current;
    const withDistance = candidates.map((c) => ({
      ...c,
      dist: current
        ? Math.hypot(c.x - current.x, c.y - current.y)
        : Infinity,
    }));
    withDistance.sort((a, b) => b.dist - a.dist); // Longest first
    const topLongest = withDistance.slice(0, PICK_FROM_TOP);
    const picked = topLongest[Math.floor(Math.random() * topLongest.length)];
    const newX = picked.x;
    const newY = picked.y;
    lastPositionRef.current = { x: newX, y: newY };

    if (instant) {
      // Click: disappear, teleport, reappear immediately
      flyButton.classList.add('instant-move', 'vanishing');
      flyButton.style.position = 'absolute';
      flyButton.style.top = `${newY}px`;
      flyButton.style.left = `${newX}px`;
      flyButton.classList.remove('flying');
      requestAnimationFrame(() => {
        flyButton.classList.remove('vanishing');
        requestAnimationFrame(() => {
          flyButton.classList.remove('instant-move');
        });
      });
    } else {
      // Automatic: flying animation - set position immediately, transition handles the move
      const moveDuration = Math.min(1000, Math.max(80, intervalDuration * 0.65));
      flyButton.classList.add('flying');
      flyButton.style.position = 'absolute';
      flyButton.style.top = `${newY}px`;
      flyButton.style.left = `${newX}px`;
      setTimeout(() => flyButton.classList.remove('flying'), moveDuration);
    }
  }, [windowSize, intervalDuration]);

  useEffect(() => {
    moveButtonRef.current = moveToNewPosition;
  }, [moveToNewPosition]);

  useEffect(() => {
    moveToNewPosition(); // Start immediately
    const interval = setInterval(() => moveToNewPosition(), intervalDuration);
    return () => clearInterval(interval);
  }, [moveToNewPosition, intervalDuration]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
    setIntervalDuration(prevInterval => Math.max(350, prevInterval - 150));
    // Trigger immediate animated move (not teleport)
    moveButtonRef.current?.(false);
  };

  return (
    <button ref={flyButtonRef} id="flyButton" className="flyButton" onClick={handleClick}>
      {count} {/* Display the current count */}
    </button>
  );
}
