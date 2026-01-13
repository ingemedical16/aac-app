"use client";

import { useState } from "react";
import styles from "./ProfileMenu.module.scss";
import { LanguageSwitcher } from "../../../settings/LanguageSwitcher";
import { ToggleSetting } from "../../../settings/ToggleSetting";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(v => !v)}
        aria-label="Profile menu"
      >
        <img src="images/me.png" className={styles.avatar} />
        <span className={styles.name}>Mohammed</span>
        ▼
      </button>

      {open && (
        <div className={styles.menu}>
          <LanguageSwitcher />

          <ToggleSetting
            label="High Contrast"
            settingKey="highContrast"
          />

          <ToggleSetting
            label="Big Buttons"
            settingKey="bigButtons"
          />

          <button className={styles.logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
