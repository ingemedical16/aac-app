"use client";

import Link from "next/link";
import styles from "./HeaderNavigationItem.module.scss";

type HeaderNavigationItemProps = {
  label: string;
  href: string;
};

export default function HeaderNavigationItem({
  label,
  href,
}: HeaderNavigationItemProps) {
  return (
    <li className={styles.item}>
      <Link href={href} className={styles.link}>
        {label}
      </Link>
    </li>
  );
}