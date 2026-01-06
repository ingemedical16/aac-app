"use client";

import styles from "./BoardGrid.module.scss";

export default function BoardGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.board}>{children}</div>;
}