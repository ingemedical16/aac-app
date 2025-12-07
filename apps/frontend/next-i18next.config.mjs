export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'ar'],
  localeDetection: true,
};

export default {
  i18n,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
