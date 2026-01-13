"use client";

import styles from "./ProfileInfo.module.scss";

type ProfileInfoProps = {
  name: string;
  avatarUrl?: string | null;
};

export default function ProfileInfo({
  name,
  avatarUrl,
}: ProfileInfoProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} />
        ) : (
          <span className={styles.initial}>
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <span className={styles.name}>{name}</span>
    </div>
  );
}