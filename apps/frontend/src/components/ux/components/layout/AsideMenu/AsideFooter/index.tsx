import { LanguageSwitcher } from "../../../settings/LanguageSwitcher";
import { ToggleSetting } from "../../../settings/ToggleSetting";
import styles from "./AsideFooter.module.scss";


export function AsideFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={styles.footer}>
      {!collapsed && (
        <>
          <LanguageSwitcher />
          <ToggleSetting label="High Contrast" settingKey="highContrast" />
          <ToggleSetting label="Big Buttons" settingKey="bigButtons" />
        </>
      )}

      <button className={styles.logout}>Logout</button>
    </div>
  );
}
