import styles from "./AsideHeader.module.scss";

export function AsideHeader({ collapsed }: { collapsed: boolean }) {
    if (collapsed) return <div className={styles.header}>AAC</div>
  return (
    <div className={styles.header}>
      <img src="images/me.png" className={styles.avatar} />
     
          <strong>Mohammed</strong>
          <span>AAC Communication</span>
      
    </div>
  );
}
