import { useEffect, useState } from "react";

const STORAGE_KEY = "aac-Sidebar-collapsed";

export function useAsideState() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  return { collapsed, setCollapsed };
}
