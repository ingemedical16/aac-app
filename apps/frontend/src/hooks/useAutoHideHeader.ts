"use client";

import { useEffect, useState } from "react";

export default function useAutoHideHeader() {
  const [hidden, setHidden] = useState(false);
  let lastY = 0;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 60);
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}
