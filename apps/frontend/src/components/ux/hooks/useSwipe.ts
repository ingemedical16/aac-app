import { useRef } from "react";

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const startX = useRef(0);

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const diff = e.changedTouches[0].clientX - startX.current;

    if (diff > 80) onSwipeRight();
    if (diff < -80) onSwipeLeft();
  }

  return { onTouchStart, onTouchEnd };
}
