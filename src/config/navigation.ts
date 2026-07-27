import {
  BookOpen, Crown, Ticket, Croissant, Gauge, Coins, Maximize2, Sparkles,
  Home, Info, Map, ScrollText,
  type LucideIcon,
} from 'lucide-react';

export const NAVIGATION_CONFIG = [
  { key: 'home', labelKey: 'nav_home', path: '/', icon: Home, showInHeader: false, showInSidebar: true, showInFooter: false, sitemap: true, priority: 1, changeFrequency: 'daily' },
  { key: 'guides', labelKey: 'nav_guides', path: '/guides', icon: BookOpen, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.9, changeFrequency: 'weekly' },
  { key: 'codes', labelKey: 'nav_codes', path: '/codes', icon: Ticket, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.9, changeFrequency: 'daily' },
  { key: 'butter-flavors', labelKey: 'nav_butterFlavors', path: '/butter-flavors', icon: Croissant, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.9, changeFrequency: 'weekly' },
  { key: 'roller-upgrades', labelKey: 'nav_rollerUpgrades', path: '/roller-upgrades', icon: Gauge, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.9, changeFrequency: 'weekly' },
  { key: 'cash-farming', labelKey: 'nav_cashFarming', path: '/cash-farming', icon: Coins, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.9, changeFrequency: 'weekly' },
  { key: 'expansion', labelKey: 'nav_expansion', path: '/expansion', icon: Maximize2, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'tier-list', labelKey: 'nav_tierList', path: '/tier-list', icon: Crown, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.9, changeFrequency: 'weekly' },
  { key: 'updates', labelKey: 'nav_updates', path: '/updates', icon: Sparkles, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'daily' },
  { key: 'about', labelKey: 'nav_about', path: '/about', icon: Info, showInHeader: false, showInSidebar: false, showInFooter: true, sitemap: true, priority: 0.7, changeFrequency: 'monthly' },
  { key: 'sitemap', labelKey: 'nav_sitemap', path: '/sitemap', icon: Map, showInHeader: false, showInSidebar: false, showInFooter: true, sitemap: false, priority: 0.5, changeFrequency: 'monthly' },
  { key: 'privacy-policy', labelKey: 'nav_privacyPolicy', path: '/privacy-policy', icon: ScrollText, showInHeader: false, showInSidebar: false, showInFooter: true, sitemap: true, priority: 0.4, changeFrequency: 'yearly' },
  { key: 'terms-of-service', labelKey: 'nav_termsOfService', path: '/terms-of-service', icon: ScrollText, showInHeader: false, showInSidebar: false, showInFooter: true, sitemap: true, priority: 0.4, changeFrequency: 'yearly' },
] as const;

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => 'isContentType' in item && item.isContentType).map((item) => item.key);

export const CONTENT_TYPES_WITH_DEDICATED_PAGES = new Set(CONTENT_TYPES);

export type NavigationItem = (typeof NAVIGATION_CONFIG)[number];
export type ContentType = (typeof CONTENT_TYPES)[number];

export function isContentType(value: string): value is ContentType {
  return CONTENT_TYPES.includes(value as ContentType);
}

export function getNavigationItem(path: string) {
  const normalized = path === '' ? '/' : path.startsWith('/') ? path : `/${path}`;
  return NAVIGATION_CONFIG.find((item) => item.path === normalized || item.key === path);
}

export const CONTENT_DIR_NAMES: Record<ContentType | string, string> = {
  guides: 'guides',
  codes: 'codes',
  'butter-flavors': 'butter-flavors',
  'roller-upgrades': 'roller-upgrades',
  'cash-farming': 'cash-farming',
  expansion: 'expansion',
  'tier-list': 'tier-list',
  updates: 'updates',
} as Record<ContentType, string>;

export function getContentDir(contentType: ContentType): string {
  return CONTENT_DIR_NAMES[contentType] || contentType;
}

export const GUIDE_CATEGORIES: Record<string, { emoji: string; order: number }> = {
  guides:            { emoji: '📘', order: 1 },
  codes:             { emoji: '🎟️', order: 2 },
  'butter-flavors':  { emoji: '🧈', order: 3 },
  'roller-upgrades': { emoji: '🛞', order: 4 },
  'cash-farming':    { emoji: '💰', order: 5 },
  expansion:         { emoji: '📐', order: 6 },
  'tier-list':       { emoji: '👑', order: 7 },
  updates:           { emoji: '✨', order: 8 },
};

export const CATEGORY_ORDER = Object.entries(GUIDE_CATEGORIES)
  .sort(([, a], [, b]) => a.order - b.order)
  .map(([key]) => key);

export const CATEGORY_AFFINITY: Record<string, string[]> = {
  guides:            ['cash-farming', 'butter-flavors', 'roller-upgrades'],
  codes:             ['updates', 'cash-farming', 'guides'],
  'butter-flavors':  ['roller-upgrades', 'tier-list', 'cash-farming'],
  'roller-upgrades': ['butter-flavors', 'expansion', 'tier-list'],
  'cash-farming':    ['butter-flavors', 'expansion', 'guides'],
  expansion:         ['roller-upgrades', 'cash-farming', 'tier-list'],
  'tier-list':       ['butter-flavors', 'roller-upgrades', 'expansion'],
  updates:           ['codes', 'guides', 'butter-flavors'],
};
