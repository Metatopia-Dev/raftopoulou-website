import { en } from "@/i18n/dictionaries/en";
import { el } from "@/i18n/dictionaries/el";
import type { Dictionary, Locale } from "@/i18n/types";

export const DEFAULT_LOCALE: Locale = "el";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  el,
};

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale];
}
