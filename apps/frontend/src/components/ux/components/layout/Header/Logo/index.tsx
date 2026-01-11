import styles from "./Logo.module.scss";

type Props = {
  short?: boolean;
};

export function Logo({ short }: Props) {
  return (
    <div className={styles.logo}>
      <strong>{short ? "AAC" : "AAC Communication"}</strong>
    </div>
  );
}
