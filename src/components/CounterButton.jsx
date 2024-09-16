import React, { useState, useEffect, useRef } from 'react';

export function CounterButton() {
  const flyButtonRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [count, setCount] = useState(0); // Initialize counter state
  const [intervalDuration, setIntervalDuration] = useState(2000); // Initialize interval duration

  useEffect(() => {
    const moveButton = () => {
      const flyButton = flyButtonRef.current;
      if (!flyButton) return;

      const { width, height } = windowSize;
      const newX = Math.random() * (width - 100); // Adjusting for button width
      const newY = Math.random() * (height - 100); // Adjusting for button height

      flyButton.classList.add('flying');

      setTimeout(() => {
        flyButton.style.position = 'absolute'; // Ensuring the button can move freely
        flyButton.style.top = `${newY}px`;
        flyButton.style.left = `${newX}px`;
      }, Math.max(300, intervalDuration - 150)); // Ensure the timeout is not faster than the interval

      setTimeout(() => {
        flyButton.classList.remove('flying');
      }, Math.max(1000, intervalDuration - 150));
    };

    const interval = setInterval(moveButton, intervalDuration);
    return () => clearInterval(interval);
  }, [windowSize, intervalDuration]); // Add intervalDuration as a dependency

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

  // Function to increment the count and reduce the interval
  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
    setIntervalDuration(prevInterval => Math.max(50, prevInterval - 150)); // Reduce interval by 150, not going below 150ms
  };

  return (
    <button ref={flyButtonRef} id="flyButton" className="flyButton" onClick={handleClick}>
      {count} {/* Display the current count */}
    </button>
  );
}
