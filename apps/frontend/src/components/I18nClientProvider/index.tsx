"use client";

export default function I18nClientProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <div data-locale={locale}>
      {children}
    </div>
  );
}
