export type Screen = 'home' | 'reveal' | 'result' | 'collection' | 'stats';
export type IdiomCategory = 'wisdom' | 'study' | 'relations' | 'nature' | 'emotion';

export interface Idiom {
  id: number;
  hanja: string;
  korean: string;
  meaning: string;
  explanation: string;
  example: string;
  origin: string;
  category: IdiomCategory;
}

export interface DailyQuestion {
  idiom: Idiom;
  blankPos: number;
  options: string[];
  correctIndex: number;
}

export interface DailyRecord {
  date: string;
  idiomId: number;
  isCorrect: boolean;
  selectedIndex: number;
}

export interface CollectionEntry {
  idiomId: number;
  collectedDate: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastDate: string;
}

export interface IdiomStats {
  totalAttempts: number;
  totalCorrect: number;
  collectionCount: number;
  categoryProgress: Record<IdiomCategory, { collected: number; total: number }>;
}

export const CATEGORY_LABELS: Record<IdiomCategory, string> = {
  wisdom: '삶과 지혜',
  study: '학문과 노력',
  relations: '인간관계',
  nature: '자연과 세상',
  emotion: '마음과 감정',
};
