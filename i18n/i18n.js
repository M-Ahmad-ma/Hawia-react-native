
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

import en from "./en.json";
import ar from "./ar.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};


export const TANKER_TYPE_KEYS: Record<string, string> = {
  small: "tanker_small",
  medium: "tanker_medium",
  large: "tanker_large",
};

const fallback = { languageTag: "en" };

export const setI18nConfig = () => {
  const locales = RNLocalize.getLocales();

  let languageTag = fallback.languageTag;

  if (Array.isArray(locales) && locales.length > 0) {
    languageTag = locales[0].languageCode === "ar" ? "ar" : "en";
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    lng:languageTag,
    fallbackLng: "en",
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
};

export default i18n;

