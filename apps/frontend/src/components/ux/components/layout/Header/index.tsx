"use client";

import styles from "./Header.module.scss";
import { MenuButton } from "./MenuButton";
import { Logo } from "./Logo";
import { ProfileMenu } from "./ProfileMenu";
import { HeaderNav } from "./HeaderNav";

type Props = {
  onToggleMenu: () => void;
};

export function Header({ onToggleMenu }: Props) {
  return (
    <header className={styles.header}>
      {/* Right */}
      <div className={styles.right}>
        <MenuButton onClick={onToggleMenu} />
        <Logo short />
      </div>

      {/* Middle */}
      <div className={styles.middle}>
        <HeaderNav />
      </div>

      {/* Left */}
      <div className={styles.left}>
        <ProfileMenu />
      </div>
    </header>
  );
}
