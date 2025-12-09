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

  const speak = (text: string, locale: string) => {
    if (!voicesLoaded) return;

    const utter = new SpeechSynthesisUtterance(text);

    // Language prefix
    const lang =
      locale === "ar" ? "ar"
      : locale === "fr" ? "fr"
      : locale === "ro" ? "ro"
      : "en";
    utter.lang = lang;

    // ------------------------------
    // ⭐ CHILD-FRIENDLY VOICE LOGIC
    // ------------------------------

    // First: Google voices (best quality)
    let preferred = voices.find(v =>
      v.lang.toLowerCase().startsWith(lang) &&
      v.name.toLowerCase().includes("google")
    );

    // Second: any voice marked as "natural"
    if (!preferred) {
      preferred = voices.find(v =>
        v.lang.toLowerCase().startsWith(lang) &&
        v.name.toLowerCase().includes("natural")
      );
    }

    // Third: any matching voice by language prefix
    if (!preferred) {
      preferred = voices.find(v =>
        v.lang.toLowerCase().startsWith(lang)
      );
    }

    // Apply voice
    if (preferred) {
      utter.voice = preferred;
    }

    // Child-friendly tuning
    utter.rate = 0.9;   // slower, easier to understand
    utter.pitch = 1.1;  // softer, more child-like
    utter.volume = 1.0; // full volume

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return { speak };
}
