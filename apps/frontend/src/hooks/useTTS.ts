"use client";

import { useEffect, useState } from "react";

export default function useTTS() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text: string, locale: string, onEnd?: () => void) => {
    if (!voicesLoaded || !text) return;

    const utter = new SpeechSynthesisUtterance(text);

    // Language prefix (broad, works better)
    const langPrefix =
      locale === "ar" ? "ar"
      : locale === "fr" ? "fr"
      : locale === "ro" ? "ro"
      : "en";

    utter.lang = langPrefix;

    // -------------------------------------
    // ⭐ Voice selection (best to fallback)
    // -------------------------------------

    // 1. Google voices → highest quality
    let preferred = voices.find(v =>
      v.lang.toLowerCase().startsWith(langPrefix) &&
      v.name.toLowerCase().includes("google")
    );

    // 2. Natural voices
    if (!preferred) {
      preferred = voices.find(v =>
        v.lang.toLowerCase().startsWith(langPrefix) &&
        v.name.toLowerCase().includes("natural")
      );
    }

    // 3. Any voice with correct prefix (fixes French issue)
    if (!preferred) {
      preferred = voices.find(v =>
        v.lang.toLowerCase().startsWith(langPrefix)
      );
    }

    if (preferred) utter.voice = preferred;

    // -------------------------------------
    // Child-friendly tuning
    // -------------------------------------
    utter.rate = 0.9;   // slower
    utter.pitch = 1.1;  // softer
    utter.volume = 1.0;

    if (onEnd) utter.onend = onEnd;

    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(utter);
  };

  return { speak, voicesLoaded };
}
