'use client';

import i18next from 'i18next';

export default function LanguageSwitcher() {
  const changeLang = (lang: string) => {
    i18next.changeLanguage(lang);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={() => changeLang('en')}>EN</button>
      <button onClick={() => changeLang('fr')}>FR</button>
      <button onClick={() => changeLang('ar')}>AR</button>
    </div>
  );
}
