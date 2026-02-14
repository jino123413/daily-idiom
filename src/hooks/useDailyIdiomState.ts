import { useState, useEffect, useCallback } from 'react';
import { DailyRecord, CollectionEntry, StreakData, IdiomStats } from '../types';
import { getTodayString } from '../utils/date-utils';
import { getDailyIdiom, calculateStats } from '../utils/idiom-utils';
import {
  getRecords, getTodayRecord, saveRecord, addToCollection,
  getCollection, getStreak, updateStreak, needsStreakShield,
  getUnlocks, unlockCollection, unlockStats, useHintToday,
  isHintUsedToday, useStreakShieldToday,
} from '../utils/storage';

export function useDailyIdiomState() {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [collection, setCollection] = useState<CollectionEntry[]>([]);
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastDate: '' });
  const [stats, setStats] = useState<IdiomStats | null>(null);
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
  const [showStreakShield, setShowStreakShield] = useState(false);
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [yesterdayMode, setYesterdayMode] = useState(false);

  const reload = useCallback(() => {
    const r = getRecords();
    const c = getCollection();
    const s = getStreak();
    const tr = getTodayRecord();
    setRecords(r);
    setCollection(c);
    setStreak(s);
    setTodayRecord(tr);
    setStats(calculateStats(r, c));
    setHintUnlocked(isHintUsedToday());
  }, []);

  useEffect(() => {
    reload();
    // Check streak shield after short delay
    const timer = setTimeout(() => {
      if (needsStreakShield() && !getTodayRecord()) {
        setShowStreakShield(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [reload]);

  const submitAnswer = useCallback((date: string, idiomId: number, selectedIndex: number, isCorrect: boolean) => {
    const record: DailyRecord = { date, idiomId, isCorrect, selectedIndex };
    saveRecord(record);
    if (isCorrect) {
      addToCollection(idiomId, date);
    }
    updateStreak(date);
    reload();
  }, [reload]);

  const handleUnlockHint = useCallback(() => {
    useHintToday();
    setHintUnlocked(true);
  }, []);

  const handleUnlockCollection = useCallback(() => {
    unlockCollection();
  }, []);

  const handleUnlockStats = useCallback(() => {
    unlockStats();
  }, []);

  const handleStreakShield = useCallback(() => {
    useStreakShieldToday();
    setShowStreakShield(false);
    setYesterdayMode(true);
  }, []);

  const dismissStreakShield = useCallback(() => {
    setShowStreakShield(false);
  }, []);

  return {
    records, collection, streak, stats, todayRecord,
    showStreakShield, hintUnlocked, yesterdayMode,
    submitAnswer, handleUnlockHint, handleUnlockCollection,
    handleUnlockStats, handleStreakShield, dismissStreakShield,
    reload, setYesterdayMode,
  };
}
