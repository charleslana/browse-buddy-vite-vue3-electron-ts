import messages from './messages';
import { app } from 'electron';
import { createI18n } from 'vue-i18n';
import { getLangPreference } from '../utils/storeUtils';

export function createI18nInstance() {
  const systemLanguage = getLangPreference() || app.getLocale().split('-')[0];
  const defaultLocale = systemLanguage in messages ? systemLanguage : 'en';

  return createI18n({
    locale: defaultLocale,
    messages,
  });
}
