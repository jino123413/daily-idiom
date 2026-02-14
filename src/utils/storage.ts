import { DailyRecord, CollectionEntry, StreakData } from '../types';
import { getTodayString, getYesterdayString } from './date-utils';

const KEYS = {
  RECORDS: 'daily-idiom-records',
  COLLECTION: 'daily-idiom-collection',
  STREAK: 'daily-idiom-streak',
  UNLOCKS: 'daily-idiom-unlocks',
};

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

// Records
export function getRecords(): DailyRecord[] {
  return loadJSON<DailyRecord[]>(KEYS.RECORDS, []);
}

export function getTodayRecord(): DailyRecord | null {
  const records = getRecords();
  const today = getTodayString();
  return records.find(r => r.date === today) || null;
}

export function getYesterdayRecord(): DailyRecord | null {
  const records = getRecords();
  const yesterday = getYesterdayString();
  return records.find(r => r.date === yesterday) || null;
}

export function saveRecord(record: DailyRecord) {
  const records = getRecords();
  // Prevent duplicate for same date
  const existing = records.findIndex(r => r.date === record.date);
  if (existing >= 0) return;
  records.push(record);
  saveJSON(KEYS.RECORDS, records);
}

// Collection
export function getCollection(): CollectionEntry[] {
  return loadJSON<CollectionEntry[]>(KEYS.COLLECTION, []);
}

export function addToCollection(idiomId: number, date: string) {
  const collection = getCollection();
  if (collection.some(c => c.idiomId === idiomId)) return;
  collection.push({ idiomId, collectedDate: date });
  saveJSON(KEYS.COLLECTION, collection);
}

export function isCollected(idiomId: number): boolean {
  return getCollection().some(c => c.idiomId === idiomId);
}

// Streak
export function getStreak(): StreakData {
  return loadJSON<StreakData>(KEYS.STREAK, {
    currentStreak: 0,
    longestStreak: 0,
    lastDate: '',
  });
}

export function updateStreak(date: string) {
  const streak = getStreak();
  const yesterday = getYesterdayString();

  if (streak.lastDate === date) return; // already updated today

  if (streak.lastDate === yesterday) {
    streak.currentStreak += 1;
  } else if (streak.lastDate === '') {
    streak.currentStreak = 1;
  } else {
    streak.currentStreak = 1;
  }

  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  streak.lastDate = date;
  saveJSON(KEYS.STREAK, streak);
}

export function isStreakAtRisk(): boolean {
  const streak = getStreak();
  if (streak.currentStreak <= 0) return false;
  const today = getTodayString();
  const yesterday = getYesterdayString();
  return streak.lastDate !== today && streak.lastDate !== yesterday && streak.currentStreak > 0;
}

export function needsStreakShield(): boolean {
  const streak = getStreak();
  const today = getTodayString();
  const yesterday = getYesterdayString();
  if (streak.currentStreak <= 0) return false;
  if (streak.lastDate === today) return false;
  if (streak.lastDate === yesterday) return false;
  return true;
}

// Unlocks (for ad-gated features)
interface Unlocks {
  collection: boolean;
  stats: boolean;
  hintUsedToday: string;
  streakShieldUsedToday: string;
}

export function getUnlocks(): Unlocks {
  return loadJSON<Unlocks>(KEYS.UNLOCKS, {
    collection: false,
    stats: false,
    hintUsedToday: '',
    streakShieldUsedToday: '',
  });
}

export function unlockCollection() {
  const u = getUnlocks();
  u.collection = true;
  saveJSON(KEYS.UNLOCKS, u);
}

export function unlockStats() {
  const u = getUnlocks();
  u.stats = true;
  saveJSON(KEYS.UNLOCKS, u);
}

export function useHintToday() {
  const u = getUnlocks();
  u.hintUsedToday = getTodayString();
  saveJSON(KEYS.UNLOCKS, u);
}

export function isHintUsedToday(): boolean {
  return getUnlocks().hintUsedToday === getTodayString();
}

export function useStreakShieldToday() {
  const u = getUnlocks();
  u.streakShieldUsedToday = getTodayString();
  saveJSON(KEYS.UNLOCKS, u);
}

export function isStreakShieldUsedToday(): boolean {
  return getUnlocks().streakShieldUsedToday === getTodayString();
}
