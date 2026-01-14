"use client";

import { useRouter } from "next/navigation";

import styles from "./Header.module.scss";
import SandwichButton from "./SandwichButton";
import Logo from "../Logo";
import HeaderNavigation from "./HeaderNavigation";
import ProfileInfo from "./ProfileInfo";
import DropdownMenu from "./DropdownMenu";

import { useProfileIdentity } from "@/hooks/useProfileIdentity";
import { ViewMode } from "@/types/viewMode";

type HeaderProps = {
  viewMode: ViewMode;
  isMobile: boolean;
  onToggleAside?: () => void;
};

export default function Header({
  viewMode,
  isMobile,
  onToggleAside,
}: HeaderProps) {
  const router = useRouter();
  const { avatarUrl, displayName } = useProfileIdentity();

  return (
    <header className={styles.header}>
      {/* ================= MOBILE LEFT ================= */}
      {isMobile && (
        <div className={styles.mobileLeft}>
          <SandwichButton onClick={onToggleAside} />
        </div>
      )}

      {/* ================= LEFT ================= */}
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

      {/* ================= CENTER ================= */}
      <div className={styles.center}>
        <HeaderNavigation viewMode={viewMode} />
      </div>

      {/* ================= RIGHT ================= */}
      <div className={styles.right}>
        <DropdownMenu
          viewMode={viewMode}
          trigger={
            <ProfileInfo
              name={displayName}
              avatarUrl={avatarUrl}
            />
          }
        />
      </div>
    </header>
  );
}