import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

import en from '@/locales/en.json';
import ko from '@/locales/ko.json';
import ja from '@/locales/ja.json';
import de from '@/locales/de.json';

const messages = { en, ko, ja, de } as const;

type Messages = typeof en;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale] as Messages,
  };
});
