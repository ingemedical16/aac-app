"use client";

import styles from "./Aside.module.scss";
import { ViewMode } from "@/types/viewMode";

type AsideProps = {
  viewMode: ViewMode;
  isOpen: boolean;
  onClose: () => void;
};

export default function Aside({ viewMode, isOpen, onClose }: AsideProps) {
  // Mobile shell only for now
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden
      />

      {/* Aside panel */}
      <aside
        className={styles.aside}
        role="navigation"
        aria-label="Side menu"
      >
        {/* Header */}
        <div className={styles.header}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Content placeholder */}
        <div className={styles.content}>
          {/* Navigation groups will be added later */}
        </div>

        {/* Footer placeholder */}
        <div className={styles.footer}>
          {/* Collapse / settings later */}
        </div>
      </aside>
    </>
  );
}
