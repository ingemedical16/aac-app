import styles from "./Header.module.scss";
import { Logo } from "./Logo";
import { HeaderNav } from "./HeaderNav";
import { ProfileMenu } from "./ProfileMenu";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.right}>
        <Logo short />
      </div>

      <div className={styles.middle}>
        <HeaderNav />
      </div>

      <div className={styles.left}>
        <ProfileMenu />
      </div>
    </header>
  );
}
