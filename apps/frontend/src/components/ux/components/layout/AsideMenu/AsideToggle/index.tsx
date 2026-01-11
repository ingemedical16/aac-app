import styles from "./AsideToggle.module.scss";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export function AsideToggle({ collapsed, onToggle }: Props) {
  return (
    <button
      className={styles.toggle}
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      <span
        className={styles.icon}
        style={{ transform: "scaleX(var(--icon-scale-x))" }}
      >
        {collapsed ? "->" : "<-"}
      </span>
    </button>
  );
}
