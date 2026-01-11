import styles from "./NavItem.module.scss";

type Props = {
  title: string;
  icon: string;
  collapsed: boolean;
};

export function NavItem({ title, icon, collapsed }: Props) {
  return (
    <div
      className={styles.item}
      tabIndex={0}
      role="button"
      aria-label={title}
      data-tooltip={collapsed ? title : undefined}
    >
      <span
        className={styles.icon}
        style={{ transform: "scaleX(var(--icon-scale-x))" }}
      >
        {icon}
      </span>

      {!collapsed && <span className={styles.title}>{title}</span>}
    </div>
  );
}
