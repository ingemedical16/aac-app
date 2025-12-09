'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../../public/locales/en/common.json';
import fr from '../../public/locales/fr/common.json';
import ar from '../../public/locales/ar/common.json';
import ro from '../../public/locales/ro/common.json';

let initialized = false;

export function initI18n() {
  if (initialized) return;

  i18next.use(initReactI18next).init({
    resources: {
      en: { common: en },
      fr: { common: fr },
      ar: { common: ar },
      ro: { common: ro }
    },
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false }
  });

  initialized = true;
}

export default i18next;
