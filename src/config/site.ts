import { routing, type Locale } from '@/i18n/routing';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crunchmybutterwiki.wiki';
export const SITE_NAME = 'Crunch My Butter! Wiki';
export const HERO_IMAGE = '/images/hero.webp';
export const LOGO_IMAGE = '/favicon.svg';
export const TWITTER_HANDLE = '';
export const GA_TRACKING_ID = 'G-EVQJHVHT2F';
export const SLUG_PREFIX = 'Crunch-My-Butter-';

export const EXTERNAL_LINKS = {
  roblox: 'https://www.roblox.com/games/87555052900625/Crunch-My-Butter',
  developer: 'https://www.roblox.com/communities/416436258/EX10',
} as const;

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function localizedPath(locale: Locale | string, path = '/') {
  const normalized = path === '' ? '/' : path.startsWith('/') ? path : `/${path}`;
  if (locale === routing.defaultLocale && normalized === '/') {
    return '/';
  }
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}
