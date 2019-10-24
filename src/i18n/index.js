import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { pt, en } from './languages'
import Auth from '../Utils/Auth'

const options = {
  interpolation: {
    escapeValue: false,
  },

  debug: true,

  lng: Auth.getLocale(),

  resources: {
    pt: {
      common: pt,
    },
    en: {
      common: en,
    },
  },

  fallbackLng: 'en',

  ns: ['common'],

  defaultNS: 'common',

  react: {
    wait: false,
    bindI18n: 'languageChanged loaded',
    bindStore: 'added removed',
    nsMode: 'default'
  },
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init(options)

export default i18n
