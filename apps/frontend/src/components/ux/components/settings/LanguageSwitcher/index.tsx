"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.scss";
import i18next from "@/lib/i18n";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  LocaleCode,
} from "@/lib/i18n/languages";

export function LanguageSwitcher() {
  const [lang, setLang] = useState<LocaleCode>(DEFAULT_LANGUAGE);
  const { t } = useTranslation();
  const isRTL = lang === "ar";
  
useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.lang = lang;
    html.dir = isRTL ? "rtl" : "ltr";

    body.classList.toggle("rtl", isRTL);
    body.classList.toggle("ltr", !isRTL);
   
  }, [lang, isRTL,] );
  useEffect(() => {
    setLang(i18next.language as LocaleCode);
  }, []);

  function changeLanguage(newLang: LocaleCode) {
    setLang(newLang);
    i18next.changeLanguage(newLang);
    localStorage.setItem("aac-language", newLang);
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{t("language")}</label>

      <select
        className={styles.select}
        value={lang}
        onChange={e => changeLanguage(e.target.value as LocaleCode)}
        aria-label="Select language"
      >
        {SUPPORTED_LANGUAGES.map(code => (
          <option key={code} value={code}>
            {code.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
