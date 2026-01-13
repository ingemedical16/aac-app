"use client";

import styles from "./Header.module.scss";
import SandwichButton from "./SandwichButton";



export default function Header() {
  return (
    <header className={styles.header}>
      {/* Mobile only */}
      <div className={styles.mobileLeft}>
        <SandwichButton />
      </div>

      {/* Desktop / Tablet landscape */}
      <div className={styles.left}>
        { /* <Logo /> */ }
      </div>

      <div className={styles.center}>
       { /* <HeaderNavigation /> */ }
      </div>

      <div className={styles.right}>
        { /* <ProfileInfo /> */ }
      </div>
    </header>
  );
}