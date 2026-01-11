import styles from "./MenuButton.module.scss";

type Props = {
  onClick: () => void;
};

export function MenuButton({ onClick }: Props) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      aria-label="Open menu"
    >
      ☰
    </button>
  );
}
