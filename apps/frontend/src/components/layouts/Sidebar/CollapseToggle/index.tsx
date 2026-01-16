"use client";

import styles from "./CollapseToggle.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CollapseToggleProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function CollapseToggle({
  collapsed,
  onToggle,
}: CollapseToggleProps) {
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-pressed={collapsed}
    >
      <span className={styles.icon}>
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </span>
    </button>
  );
}