import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { I18nManager } from 'react-native';

const TRANSLATION_URL = 'https://hawia.sa/admin/translate.json';

const transformTranslations = data => {
  const en = {};
  const ar = {};

  Object.keys(data).forEach(key => {
    en[key] = data[key].en || '';
    ar[key] = data[key].ar || '';
  });

  return {
    en: { translation: en },
    ar: { translation: ar },
  };
};

const fetchTranslations = async () => {
  try {
    const response = await fetch(TRANSLATION_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return transformTranslations(data);
  } catch (error) {
    console.error('Failed to fetch translations:', error);
    return null;
  }
};

const fallback = { languageTag: 'en' };

export const setI18nConfig = async () => {
  const locales = RNLocalize.getLocales();

  let languageTag = fallback.languageTag;

  if (Array.isArray(locales) && locales.length > 0) {
    languageTag = locales[0].languageCode === 'ar' ? 'ar' : 'en';
  }

  const isRTL = languageTag === 'ar';

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }

  const resources = await fetchTranslations();

  if (resources) {
    i18n.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      lng: languageTag,
      fallbackLng: 'en',
      resources,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }
};

export const TANKER_TYPE_KEYS = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

export default i18n;
