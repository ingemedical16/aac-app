"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";

/* =========================
   EN
========================= */
import enCommon from "../../../public/locales/en/common.json";
import enTiles from "../../../public/locales/en/tiles.json";
import enCategories from "../../../public/locales/en/categories.json";
import enGroups from "../../../public/locales/en/groups.json";

/* =========================
   FR
========================= */
import frCommon from "../../../public/locales/fr/common.json";
import frTiles from "../../../public/locales/fr/tiles.json";
import frCategories from "../../../public/locales/fr/categories.json";
import frGroups from "../../../public/locales/fr/groups.json";

/* =========================
   AR
========================= */
import arCommon from "../../../public/locales/ar/common.json";
import arTiles from "../../../public/locales/ar/tiles.json";
import arCategories from "../../../public/locales/ar/categories.json";
import arGroups from "../../../public/locales/ar/groups.json";

/* =========================
   RO
========================= */
import roCommon from "../../../public/locales/ro/common.json";
import roTiles from "../../../public/locales/ro/tiles.json";
import roCategories from "../../../public/locales/ro/categories.json";
import roGroups from "../../../public/locales/ro/groups.json";

let initialized = false;

export function initI18n() {
  if (initialized) return;

  i18next.use(initReactI18next).init({
    resources: {
      en: {
        common: enCommon,
        tiles: enTiles,
        categories: enCategories,
        groups: enGroups,
      },
      fr: {
        common: frCommon,
        tiles: frTiles,
        categories: frCategories,
        groups: frGroups,
      },
      ar: {
        common: arCommon,
        tiles: arTiles,
        categories: arCategories,
        groups: arGroups,
      },
      ro: {
        common: roCommon,
        tiles: roTiles,
        categories: roCategories,
        groups: roGroups,
      },
    },

    /* ✅ ALL namespaces used in the app */
    ns: ["common", "tiles", "categories", "groups"],
    defaultNS: "common",

    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

  initialized = true;
}

export default i18next;
