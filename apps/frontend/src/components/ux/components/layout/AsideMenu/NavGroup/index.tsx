import styles from "./NavGroup.module.scss";
import { NavItem } from "../NavItem";

export function NavGroup({
  title,
  items,
  collapsed,
  onItemClick,
}: any) {
  return (
    <div className={styles.group}>
      {!collapsed && <div className={styles.title}>{title}</div>}
      {items.map((item: any) => (
        <NavItem
          key={item.title}
          {...item}
          collapsed={collapsed}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}
