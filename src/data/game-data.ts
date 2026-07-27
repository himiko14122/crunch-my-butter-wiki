import { Croissant, CircleDollarSign, Maximize2, Hand, Timer, Coins, Moon, Repeat, Gauge, type LucideIcon } from 'lucide-react';

/* ──────────────── Progression Track Interface ──────────────── */
/* Crunch My Butter has four confirmed progression tracks (EX10 official loop):
   crunch butter → collect cash → unlock better butter → upgrade roller / expand area.
   We rank the TRACKS, never invented item names — no flavor or roller tier list
   has ever been published for this game. */
export interface ProgressionTrack {
  id: string;
  nameKey: string;
  tier: string;
  roleKey: string;
  payoffKey: string;
  timingKey: string;
  icon: LucideIcon;
}

export const progressionTracks: ProgressionTrack[] = [
  { id: 'butter-unlocks', nameKey: 'track_butterUnlocks', tier: 'S', roleKey: 'track_role_incomeMultiplier', payoffKey: 'track_payoff_highest', timingKey: 'track_timing_always', icon: Croissant },
  { id: 'roller-upgrades', nameKey: 'track_rollerUpgrades', tier: 'A', roleKey: 'track_role_throughput', payoffKey: 'track_payoff_high', timingKey: 'track_timing_whenButterOutpaces', icon: Gauge },
  { id: 'area-expansion', nameKey: 'track_areaExpansion', tier: 'B', roleKey: 'track_role_surface', payoffKey: 'track_payoff_medium', timingKey: 'track_timing_whenRollerSpare', icon: Maximize2 },
  { id: 'manual-crunching', nameKey: 'track_manualCrunching', tier: 'C', roleKey: 'track_role_starter', payoffKey: 'track_payoff_low', timingKey: 'track_timing_firstMinutes', icon: Hand },
];

/* ──────────────── Cash Source Interface ──────────────── */
export interface CashSource {
  id: string;
  nameKey: string;
  tier: string;
  descKey: string;
  modeKey: string;
  icon: LucideIcon;
}

export const cashSources: CashSource[] = [
  { id: 'crunch-rhythm', nameKey: 'cash_crunchRhythm', tier: 'S', descKey: 'cash_crunchRhythm_desc', modeKey: 'cash_mode_active', icon: Timer },
  { id: 'floor-collection', nameKey: 'cash_floorCollection', tier: 'S', descKey: 'cash_floorCollection_desc', modeKey: 'cash_mode_active', icon: Coins },
  { id: 'offline-earnings', nameKey: 'cash_offlineEarnings', tier: 'A', descKey: 'cash_offlineEarnings_desc', modeKey: 'cash_mode_idle', icon: Moon },
  { id: 'reinvestment', nameKey: 'cash_reinvestment', tier: 'A', descKey: 'cash_reinvestment_desc', modeKey: 'cash_mode_economy', icon: Repeat },
  { id: 'session-order', nameKey: 'cash_sessionOrder', tier: 'B', descKey: 'cash_sessionOrder_desc', modeKey: 'cash_mode_routine', icon: CircleDollarSign },
];

/* ──────────────── Live Game Stat Interface ──────────────── */
/* All values verified against the official Roblox game page on 2026-07-26. */
export interface GameStat {
  id: string;
  labelKey: string;
  value: string;
  tier: string;
  noteKey: string;
}

export const gameStats: GameStat[] = [
  { id: 'visits', labelKey: 'stat_visits', value: '5.4M+', tier: 'S', noteKey: 'stat_visits_note' },
  { id: 'favorites', labelKey: 'stat_favorites', value: '39K+', tier: 'S', noteKey: 'stat_favorites_note' },
  { id: 'rating', labelKey: 'stat_rating', value: '93%', tier: 'S', noteKey: 'stat_rating_note' },
  { id: 'ccu', labelKey: 'stat_ccu', value: '3,400+', tier: 'A', noteKey: 'stat_ccu_note' },
  { id: 'servers', labelKey: 'stat_servers', value: '8', tier: 'B', noteKey: 'stat_servers_note' },
  { id: 'genre', labelKey: 'stat_genre', value: 'Incremental Simulator', tier: 'B', noteKey: 'stat_genre_note' },
  { id: 'released', labelKey: 'stat_released', value: 'Jun 29, 2026', tier: 'B', noteKey: 'stat_released_note' },
  { id: 'nextUpdate', labelKey: 'stat_nextUpdate', value: 'Aug 1, 2026', tier: 'A', noteKey: 'stat_nextUpdate_note' },
];

/* ──────────────── Tier Colors ──────────────── */
export const TIER_COLOR_MAP: Record<string, string> = {
  S: 'var(--color-tier-s)',
  A: 'var(--color-tier-a)',
  B: 'var(--color-tier-b)',
  C: 'var(--color-tier-c)',
};

export const TIER_COLOR_DEFAULT = 'var(--color-tier-c)';

export function tierColor(tier: string): string {
  return TIER_COLOR_MAP[tier] || TIER_COLOR_DEFAULT;
}

/* ──────────────── Cash Mode Colors ──────────────── */
export const CASH_MODE_COLOR_MAP: Record<string, string> = {
  cash_mode_active: '#FFC400',
  cash_mode_idle: '#2B6BE4',
  cash_mode_economy: '#F9A800',
  cash_mode_routine: '#7E8CAE',
};

export function cashModeColor(mode: string): string {
  return CASH_MODE_COLOR_MAP[mode] || '#7E8CAE';
}

/* ──────────────── Track Role Colors ──────────────── */
export const TRACK_ROLE_COLOR_MAP: Record<string, string> = {
  track_role_incomeMultiplier: '#FFDD00',
  track_role_throughput: '#2B6BE4',
  track_role_surface: '#F9A800',
  track_role_starter: '#8A97AF',
};

export function trackRoleColor(role: string): string {
  return TRACK_ROLE_COLOR_MAP[role] || '#8A97AF';
}

/* ──────────────── Icons ──────────────── */
export const TRACK_ICONS: Record<string, LucideIcon> = {
  'butter-unlocks': Croissant,
  'roller-upgrades': Gauge,
  'area-expansion': Maximize2,
  'manual-crunching': Hand,
};

export const CASH_ICONS: Record<string, LucideIcon> = {
  'crunch-rhythm': Timer,
  'floor-collection': Coins,
  'offline-earnings': Moon,
  'reinvestment': Repeat,
  'session-order': CircleDollarSign,
};
