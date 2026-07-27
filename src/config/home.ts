import {
  BookOpen, Crown, Ticket, Croissant, Gauge, Coins, Maximize2, Sparkles,
  Headphones, BarChart3, Users, Smartphone,
  type LucideIcon,
} from 'lucide-react';

export interface StatConfig {
  val: string;
  labelKey: string;
}

export interface ModuleCardConfig {
  key: string;
  labelKey: string;
  titleKey: string;
  descKey: string;
  href: string;
  stats: StatConfig[];
  icon: LucideIcon;
  ctaKey?: string;
}

export interface GameFeatureConfig {
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
}

export interface StartHereStepConfig {
  titleKey: string;
  descKey: string;
  href: string;
}

export interface HeroCtaConfig {
  labelKey: string;
  href: string;
  style: 'primary' | 'secondary';
}

export const HOME_CONFIG = {
  hero: {
    // Yasi_ — "CRUNCH My Butter SQUISHY!" (no official EX10 trailer exists)
    videoId: 'r5hakZg2-b8',
    badgeKeys: [
      'home_hero_badge_release',
      'home_hero_badge_updated',
      'home_hero_badge_visits',
      'home_hero_badge_rating',
      'home_hero_badge_servers',
      'home_hero_badge_nextUpdate',
    ],
    ctas: [
      { labelKey: 'home_hero_cta_guides', href: '/guides', style: 'primary' as const },
      { labelKey: 'home_hero_cta_butterFlavors', href: '/butter-flavors', style: 'secondary' as const },
      { labelKey: 'home_hero_cta_codes', href: '/codes', style: 'secondary' as const },
    ],
  },

  moduleCards: [
    { key: 'guides', labelKey: 'home_module_guides', titleKey: 'home_module_guides_title', descKey: 'home_module_guides_desc', href: '/guides', stats: [{ val: '__guideCount', labelKey: 'home_module_guides_count' }, { val: '5', labelKey: 'home_module_loop_steps' }], icon: BookOpen, ctaKey: 'home_module_guides_cta' },
    { key: 'codes', labelKey: 'home_module_codes', titleKey: 'home_module_codes_title', descKey: 'home_module_codes_desc', href: '/codes', stats: [{ val: '0', labelKey: 'home_module_active_codes' }, { val: 'Jul 26, 2026', labelKey: 'home_module_last_checked' }], icon: Ticket, ctaKey: 'home_module_codes_cta' },
    { key: 'butter-flavors', labelKey: 'home_module_butterFlavors', titleKey: 'home_module_butterFlavors_title', descKey: 'home_module_butterFlavors_desc', href: '/butter-flavors', stats: [{ val: 'Salted Butter', labelKey: 'home_module_confirmed_flavor' }, { val: 'S', labelKey: 'home_module_track_tier' }], icon: Croissant, ctaKey: 'home_module_butterFlavors_cta' },
    { key: 'roller-upgrades', labelKey: 'home_module_rollerUpgrades', titleKey: 'home_module_rollerUpgrades_title', descKey: 'home_module_rollerUpgrades_desc', href: '/roller-upgrades', stats: [{ val: 'A', labelKey: 'home_module_track_tier' }, { val: '5', labelKey: 'home_module_decision_steps' }], icon: Gauge, ctaKey: 'home_module_rollerUpgrades_cta' },
    { key: 'cash-farming', labelKey: 'home_module_cashFarming', titleKey: 'home_module_cashFarming_title', descKey: 'home_module_cashFarming_desc', href: '/cash-farming', stats: [{ val: '__cashSourceCount', labelKey: 'home_module_cash_sources' }, { val: '24/7', labelKey: 'home_module_offline_income' }], icon: Coins, ctaKey: 'home_module_cashFarming_cta' },
    { key: 'expansion', labelKey: 'home_module_expansion', titleKey: 'home_module_expansion_title', descKey: 'home_module_expansion_desc', href: '/expansion', stats: [{ val: 'B', labelKey: 'home_module_track_tier' }, { val: '5', labelKey: 'home_module_decision_steps' }], icon: Maximize2, ctaKey: 'home_module_expansion_cta' },
    { key: 'tier-list', labelKey: 'home_module_tierList', titleKey: 'home_module_tierList_title', descKey: 'home_module_tierList_desc', href: '/tier-list', stats: [{ val: 'S-A-B-C', labelKey: 'home_module_tier_levels' }, { val: '__trackCount', labelKey: 'home_module_ranked_tracks' }], icon: Crown, ctaKey: 'home_module_tierList_cta' },
    { key: 'updates', labelKey: 'home_module_updates', titleKey: 'home_module_updates_title', descKey: 'home_module_updates_desc', href: '/updates', stats: [{ val: 'Aug 1, 2026', labelKey: 'home_module_update2_date' }, { val: '17:00 UTC', labelKey: 'home_module_update2_time' }], icon: Sparkles, ctaKey: 'home_module_updates_cta' },
  ] as ModuleCardConfig[],

  gameFeatures: [
    { titleKey: 'home_feature_asmr', descKey: 'home_feature_asmr_desc', icon: Headphones },
    { titleKey: 'home_feature_idle', descKey: 'home_feature_idle_desc', icon: Coins },
    { titleKey: 'home_feature_stats', descKey: 'home_feature_stats_desc', icon: BarChart3 },
    { titleKey: 'home_feature_developer', descKey: 'home_feature_developer_desc', icon: Users },
    { titleKey: 'home_feature_mobile', descKey: 'home_feature_mobile_desc', icon: Smartphone },
    { titleKey: 'home_feature_noCodes', descKey: 'home_feature_noCodes_desc', icon: Ticket },
  ] as GameFeatureConfig[],

  startHereSteps: [
    { titleKey: 'home_start_1_title', descKey: 'home_start_1_desc', href: '/guides' },
    { titleKey: 'home_start_2_title', descKey: 'home_start_2_desc', href: '/cash-farming' },
    { titleKey: 'home_start_3_title', descKey: 'home_start_3_desc', href: '/roller-upgrades' },
    { titleKey: 'home_start_4_title', descKey: 'home_start_4_desc', href: '/butter-flavors' },
    { titleKey: 'home_start_5_title', descKey: 'home_start_5_desc', href: '/cash-farming' },
    { titleKey: 'home_start_6_title', descKey: 'home_start_6_desc', href: '/expansion' },
  ] as StartHereStepConfig[],

  gameOverview: {
    infoItems: ['developer', 'platform', 'genre', 'releaseDate', 'visits', 'favorites', 'rating', 'playersOnline', 'serverSize', 'nextUpdate'],
    cta: {
      guideLabelKey: 'home_about_cta',
      guideHref: '/guides',
      externalLabelKey: 'home_cta_roblox',
      externalLinkKey: 'roblox',
    },
  },

  faq: {
    keys: ['hasCodes', 'howToPlay', 'bestUpgrade', 'butterFlavors', 'offlineCash', 'rollerVsButter', 'whenExpand', 'update2', 'whoMadeIt', 'isFree'],
  },

  keywordHub: {
    titleKey: 'home_keywordHub_title',
    descKey: 'home_keywordHub_desc',
    links: [
      { label: 'crunch my butter codes', href: '/codes' },
      { label: 'crunch my butter beginner guide', href: '/guides' },
      { label: 'crunch my butter all butters', href: '/butter-flavors' },
      { label: 'crunch my butter best roller', href: '/roller-upgrades' },
      { label: 'crunch my butter how to get money fast', href: '/cash-farming' },
      { label: 'crunch my butter expansion guide', href: '/expansion' },
      { label: 'crunch my butter tier list', href: '/tier-list' },
      { label: 'crunch my butter update 2', href: '/updates' },
      { label: 'crunch my butter offline earnings', href: '/cash-farming' },
      { label: 'crunch my butter salted butter', href: '/butter-flavors' },
      { label: 'crunch my butter roller upgrade cost', href: '/roller-upgrades' },
      { label: 'crunch my butter how to expand', href: '/expansion' },
      { label: 'crunch my butter working codes 2026', href: '/codes' },
      { label: 'crunch my butter best upgrades', href: '/tier-list' },
      { label: 'crunch my butter cash per crunch', href: '/cash-farming' },
      { label: 'crunch my butter roblox how to play', href: '/guides' },
      { label: 'crunch my butter update log', href: '/updates' },
      { label: 'crunch my butter asmr', href: '/guides' },
    ],
  },

  bottomCta: {
    guideHref: '/guides',
    guideLabelKey: 'home_cta_guide',
    externalLinkKey: 'roblox',
    externalLabelKey: 'home_cta_roblox',
  },
};
