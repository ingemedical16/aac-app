"use client";

import { useRouter } from "next/navigation";

import styles from "./Header.module.scss";
import SandwichButton from "./SandwichButton";
import Logo from "../Logo";
import HeaderNavigation from "./HeaderNavigation";
import ProfileInfo from "./ProfileInfo";
 import { useProfileIdentity } from "@/hooks/useProfileIdentity";



export default function Header() {


const { avatarUrl, displayName } = useProfileIdentity();
const router = useRouter();

  return (
    <header className={styles.header}>
      {/* Mobile only */}
      <div className={styles.mobileLeft}>
        <SandwichButton />
      </div>

      {/* Desktop / Tablet landscape */}
       {/* Left */}
      <div className={styles.left}>
        <button
          className={styles.logoButton}
          onClick={() => router.push("/")}
          aria-label="Go to home"
        >
          <span className={styles.logoFull}>
            <Logo variant="full" />
          </span>

          <span className={styles.logoCompact}>
            <Logo variant="compact" />
          </span>
        </button>
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