import styles from "./HeaderNav.module.scss";

const menuItems = ["Dashboard", "Board", "Profiles"];

export function HeaderNav() {
  return (
    <nav className={styles.nav}>
      {menuItems.map(item => (
        <button key={item} className={styles.item}>
          {item}
        </button>
      ))}
    </nav>
  );
}
