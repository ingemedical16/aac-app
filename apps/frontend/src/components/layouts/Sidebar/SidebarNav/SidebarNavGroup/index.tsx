"use client";

import styles from "./SidebarNavGroup.module.scss";
import SidebarNavItem from "../SidebarNavItem";
import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";
import type { SidebarNavGroup as GroupType } from "@/types/sidebar";
import { useRouter } from "next/navigation";

type SidebarNavGroupProps = {
  group: GroupType;
  collapsed: boolean;
  activePath: string;
  onNavigate: () => void;
};

export default function SidebarNavGroup({
  group,
  collapsed,
  activePath,
  onNavigate,
}: SidebarNavGroupProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className={styles.group}>
      {group.titleKey && !collapsed && (
        <div className={styles.title}>
          {t(tx("common", group.titleKey))}
        </div>
      )}

      <ul className={styles.list}>
        {group.items.map((item) => (
          <li key={item.key}>
            <SidebarNavItem
              label={t(tx("common", item.labelKey))}
              icon={item.icon}
              collapsed={collapsed}
              disabled={item.disabled}
              active={activePath === item.href}
              onClick={() => {
                if (item.disabled) return;

                // Navigate
                router.push(item.href);

                // Close sidebar on mobile
                onNavigate();
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
