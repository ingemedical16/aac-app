"use client";

import styles from "./Header.module.scss";
import SandwichButton from "./SandwichButton";
import Logo from "../Logo";
import HeaderNavigation from "./HeaderNavigation";
import ProfileInfo from "./ProfileInfo";
 import { useProfileIdentity } from "@/hooks/useProfileIdentity";



export default function Header() {


const { avatarUrl, displayName } = useProfileIdentity();
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
       <ProfileInfo name={displayName} avatarUrl={avatarUrl} /> 
      </div>
    </header>
  );
}