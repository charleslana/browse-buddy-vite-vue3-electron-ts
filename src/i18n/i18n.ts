import messages from './messages';
import { createI18n } from 'vue-i18n';

const systemLanguage = navigator.language.split('-')[0];

const defaultLocale = systemLanguage in messages ? systemLanguage : 'en';

const i18n = createI18n({
  locale: defaultLocale,
  messages,
});

export default i18n;