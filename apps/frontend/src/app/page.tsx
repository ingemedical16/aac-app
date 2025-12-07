'use client';

import { useEffect } from 'react';
import { initI18n } from '../lib/i18n';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function HomePage() {
  useEffect(() => initI18n(), []);

  const { t } = useTranslation('common');

  return (
    <div style={{ padding: 20 }}>
      <h1>{t('appTitle')}</h1>
      <LanguageSwitcher />
      <p>{t('tapToSpeak')}</p>
    </div>
  );
}
