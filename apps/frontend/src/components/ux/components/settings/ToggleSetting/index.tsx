"use client";

import { useEffect, useState } from "react";
import styles from "./ToggleSetting.module.scss";

type Props = {
  label: string;
  settingKey: "highContrast" | "bigButtons";
};

export function ToggleSetting({ label, settingKey }: Props) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`aac-setting-${settingKey}`);
    if (saved === "true") {
      setEnabled(true);
      applySetting(true);
    }
  }, []);

  function applySetting(value: boolean) {
    const body = document.body;

    if (settingKey === "highContrast") {
      body.classList.toggle("hc", value);
    }

    if (settingKey === "bigButtons") {
      body.classList.toggle("big", value);
    }
  }

  function toggle() {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem(`aac-setting-${settingKey}`, String(newValue));
    applySetting(newValue);
  }

  return (
    <button
      className={`${styles.toggle} ${enabled ? styles.active : ""}`}
      onClick={toggle}
      aria-pressed={enabled}
    >
      <span>{label}</span>
      <span className={styles.state}>{enabled ? "ON" : "OFF"}</span>
    </button>
  );
}
