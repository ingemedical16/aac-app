'use client';

export default function useTTS() {
  const speak = (text: string, locale: string) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale === "ar" ? "ar-SA"
                : locale === "fr" ? "fr-FR"
                : "en-US";
    window.speechSynthesis.speak(utter);
  };

  return { speak };
}
