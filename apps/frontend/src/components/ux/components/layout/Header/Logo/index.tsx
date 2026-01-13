import styles from "./Logo.module.scss";

export function Logo({ short }: { short?: boolean }) {
  return <div className={styles.logo}>{short ? "AAC" : "AAC Communication"}</div>;
}
