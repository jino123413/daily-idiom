import { Idiom, DailyQuestion, IdiomCategory, IdiomStats } from '../types';
import { idiomsWisdom } from '../data/idioms-wisdom';
import { idiomsStudy } from '../data/idioms-study';
import { idiomsRelations } from '../data/idioms-relations';
import { idiomsNature } from '../data/idioms-nature';
import { idiomsEmotion } from '../data/idioms-emotion';
import { DailyRecord, CollectionEntry } from '../types';

export const ALL_IDIOMS: Idiom[] = [
  ...idiomsWisdom,
  ...idiomsStudy,
  ...idiomsRelations,
  ...idiomsNature,
  ...idiomsEmotion,
];

export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

export function getDailyIdiom(dateString: string, yesterdayMode = false): DailyQuestion {
  const seed = yesterdayMode ? dateString + 'daily-idiom-v1-yesterday' : dateString + 'daily-idiom-v1';
  const hash = hashCode(seed);
  const idx = Math.abs(hash) % ALL_IDIOMS.length;
  const idiom = ALL_IDIOMS[idx];
  const blankPos = Math.abs(hashCode(dateString + 'blank' + (yesterdayMode ? '-y' : ''))) % 4;
  const { options, correctIndex } = generateOptions(idiom, blankPos);
  return { idiom, blankPos, options, correctIndex };
}

export function generateOptions(idiom: Idiom, blankPos: number): { options: string[]; correctIndex: number } {
  const correctChar = idiom.hanja[blankPos];
  const correctKorean = idiom.korean[blankPos];
  const correct = `${correctKorean}(${correctChar})`;

  // Gather candidates from other idioms at the same position
  const candidates: string[] = [];
  for (const other of ALL_IDIOMS) {
    if (other.id === idiom.id) continue;
    const char = other.hanja[blankPos];
    const kr = other.korean[blankPos];
    const label = `${kr}(${char})`;
    if (label !== correct && !candidates.includes(label)) {
      candidates.push(label);
    }
    if (candidates.length >= 20) break;
  }

  // Shuffle and pick 3
  const shuffled = candidates.sort(() => Math.random() - 0.5).slice(0, 3);

  // Use hash-based deterministic shuffle instead of Math.random for consistency
  const allOptions = [correct, ...shuffled];

  // Deterministic shuffle using idiom id
  const seed = idiom.id + blankPos * 100;
  const result = [...allOptions];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.abs(hashCode(`${seed}-${i}`)) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return {
    options: result,
    correctIndex: result.indexOf(correct),
  };
}

export function getIdiomById(id: number): Idiom | undefined {
  return ALL_IDIOMS.find(i => i.id === id);
}

export function getIdiomsByCategory(category: IdiomCategory): Idiom[] {
  return ALL_IDIOMS.filter(i => i.category === category);
}

export function calculateStats(
  records: DailyRecord[],
  collection: CollectionEntry[]
): IdiomStats {
  const categories: IdiomCategory[] = ['wisdom', 'study', 'relations', 'nature', 'emotion'];
  const categoryProgress: IdiomStats['categoryProgress'] = {} as any;

  for (const cat of categories) {
    const total = ALL_IDIOMS.filter(i => i.category === cat).length;
    const collected = collection.filter(c => {
      const idiom = ALL_IDIOMS.find(i => i.id === c.idiomId);
      return idiom?.category === cat;
    }).length;
    categoryProgress[cat] = { collected, total };
  }

  return {
    totalAttempts: records.length,
    totalCorrect: records.filter(r => r.isCorrect).length,
    collectionCount: collection.length,
    categoryProgress,
  };
}
