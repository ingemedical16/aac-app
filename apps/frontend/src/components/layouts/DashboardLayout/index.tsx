// src/components/layouts/DashboardLayout.tsx
"use client";

import styles from "./DashboardLayout.module.scss";


interface DashboardLayoutProps {
  aside: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardLayout({
  aside,
  children,
}: DashboardLayoutProps) {
  return (
    <div className={styles.layout}>
      {/* Header */}

      <div className={styles.container}>
        <aside className={styles.aside}>{aside}</aside>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
