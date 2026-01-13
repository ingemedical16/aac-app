"use client";

import Image from "next/image";
import styles from "./Logo.module.scss";
import clsx from "clsx";

export type LogoProps = {
  /**
   * compact = icon only (mobile, aside, favicon-like usage)
   * full = icon + text
   */
  variant?: "full" | "compact";
  /**
   * Optional click handler (ex: go home)
   */
  onClick?: () => void;
  /**
   * Optional className for layout integration
   */
  className?: string;
};

export default function Logo({
  variant = "full",
  onClick,
  className,
}: LogoProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={clsx(styles.logo, className)}
      onClick={onClick}
      role={onClick ? "button" : "img"}
      aria-label="AAC Logo"
    >
      <Image
        src={
          isCompact
            ? "/logo/logo-icon.svg"
            : "/logo/logo.svg"
        }
        alt="AAC"
        width={isCompact ? 36 : 140}
        height={36}
        priority
      />
    </div>
  );
}