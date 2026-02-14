import React, { useMemo } from 'react';
import { StreakData, IdiomStats, DailyRecord, IdiomCategory, CATEGORY_LABELS } from '../types';

interface StatsScreenProps {
  streak: StreakData;
  stats: IdiomStats;
  records: DailyRecord[];
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const CATEGORIES: IdiomCategory[] = ['wisdom', 'study', 'relations', 'nature', 'emotion'];

function getMonthCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

const MILESTONES = [
  { count: 1, label: '첫 수집', icon: '🏁' },
  { count: 10, label: '10종 달성', icon: '⭐' },
  { count: 50, label: '50종 달성', icon: '🏆' },
  { count: 100, label: '100종 달성', icon: '👑' },
];

// 먹물 농도 라벨 — 정답률 대체 시각 메타포 (점수/등급 금지)
function getInkDensityLabel(ratio: number): string {
  if (ratio >= 0.9) return '진묵';   // 진한 먹
  if (ratio >= 0.7) return '농묵';   // 짙은 먹
  if (ratio >= 0.5) return '중묵';   // 중간 먹
  if (ratio >= 0.3) return '담묵';   // 연한 먹
  if (ratio > 0) return '연묵';     // 엷은 먹
  return '백지';                      // 아직 시작 전
}

const StatsScreen: React.FC<StatsScreenProps> = ({ streak, stats, records }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const weeks = useMemo(() => getMonthCalendar(year, month), [year, month]);

  const recordMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const r of records) map[r.date] = r.isCorrect;
    return map;
  }, [records]);

  const accuracy = stats.totalAttempts > 0 ? stats.totalCorrect / stats.totalAttempts : 0;
  const inkLabel = getInkDensityLabel(accuracy);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header — 세계관: 수련 기록 (NO ← back button — 토스 네비바 사용) */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/85 text-center py-3.5">
        <h1 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          나의 수련 기록
        </h1>
      </header>

      <div className="px-5 pb-8">
        {/* 수련 연속 — 불꽃 메타포 */}
        <div className="scroll-card p-5 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[11px] font-medium mb-1"
                style={{ color: 'var(--text-tertiary)', letterSpacing: '2px' }}
              >
                수련 연속
              </p>
              <div className="flex items-center gap-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--primary)">
                  <path d="M12 2c1 4-4 6-4 10a6 6 0 0012 0c0-4-3-5-3-8-1 2-3 2-4 0s-1-4 1-6l-2 4z" />
                </svg>
                <span className="text-[28px] font-bold" style={{ color: 'var(--primary)' }}>
                  {streak.currentStreak}<span className="text-[16px] ml-0.5">일</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <p
                className="text-[11px] font-medium mb-1"
                style={{ color: 'var(--text-tertiary)', letterSpacing: '2px' }}
              >
                최장 기록
              </p>
              <span className="text-xl font-bold" style={{ color: 'var(--text-secondary)' }}>
                {streak.longestStreak}<span className="text-[13px] ml-0.5">일</span>
              </span>
            </div>
          </div>
        </div>

        {/* 먹물 농도 — 정답률 대체 (먹물 벼루 메타포, 퍼센트 금지) */}
        <div className="scroll-card p-5 mb-4">
          <p
            className="text-[11px] font-bold mb-3"
            style={{ color: 'var(--text-tertiary)', letterSpacing: '2px' }}
          >
            먹물 농도
          </p>
          <div className="flex items-center gap-4">
            {/* 먹물 벼루 시각화 */}
            <div
              className="ink-well w-16 h-20 rounded-xl"
              style={{ background: '#F5F5F4', border: '2px solid #E7E5E4' }}
            >
              <div
                className="ink-well-fill rounded-b-[10px]"
                style={{
                  height: `${Math.round(accuracy * 100)}%`,
                  background: 'linear-gradient(180deg, #44403C 0%, #1C1917 100%)',
                }}
              />
            </div>
            <div className="flex-1">
              <p className="text-[22px] font-bold mb-0.5" style={{ color: 'var(--hanja)' }}>
                {inkLabel}
              </p>
              <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {stats.totalCorrect}문제 정답 / {stats.totalAttempts}문제 풀이
              </p>
            </div>
          </div>
        </div>

        {/* 월간 수련 기록 (달력 히트맵) */}
        <div className="scroll-card p-5 mb-4">
          <p
            className="text-[11px] font-bold mb-3"
            style={{ color: 'var(--text-tertiary)', letterSpacing: '2px' }}
          >
            {year}년 {month + 1}월 수련
          </p>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="text-center text-[10px] font-medium"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* 달력 그리드 */}
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
              {week.map((day, di) => {
                if (day === null) {
                  return <div key={di} className="w-full aspect-square" />;
                }
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const result = recordMap[dateStr];
                const isToday = day === now.getDate();

                return (
                  <div
                    key={di}
                    className="w-full aspect-square flex items-center justify-center rounded-md text-[11px] font-medium relative"
                    style={{
                      color: result !== undefined ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      background: isToday ? 'var(--primary-light)' : 'transparent',
                    }}
                  >
                    {day}
                    {result !== undefined && (
                      <div
                        className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full"
                        style={{
                          background: result ? 'var(--correct)' : 'var(--wrong)',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* 범례 */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--correct)' }} />
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>정답</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--wrong)' }} />
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>오답</span>
            </div>
          </div>
        </div>

        {/* 분야별 수집 — 붓 자국 두께 메타포 (비정형 배치) */}
        <div className="scroll-card p-5 mb-4">
          <p
            className="text-[11px] font-bold mb-4"
            style={{ color: 'var(--text-tertiary)', letterSpacing: '2px' }}
          >
            분야별 수집
          </p>
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const progress = stats.categoryProgress[cat];
              const ratio = progress.total > 0 ? progress.collected / progress.total : 0;
              // 붓 자국 두께가 수집률에 비례 (비정형: 시각 채널로 표현)
              const thickness = Math.max(4, Math.round(ratio * 16));
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span
                    className="text-[12px] font-medium w-[72px] shrink-0"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <div className="flex-1 relative" style={{ height: '16px' }}>
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                      <div
                        className="w-full rounded-full transition-all duration-500"
                        style={{
                          height: `${thickness}px`,
                          background: ratio > 0
                            ? `linear-gradient(90deg, var(--hanja) 0%, var(--hanja) ${ratio * 100}%, #E7E5E4 ${ratio * 100}%)`
                            : '#E7E5E4',
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className="text-[11px] font-bold w-[40px] text-right shrink-0"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {progress.collected}/{progress.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 수집 업적 마일스톤 — 인장 */}
        <div className="scroll-card p-5">
          <p
            className="text-[11px] font-bold mb-4"
            style={{ color: 'var(--text-tertiary)', letterSpacing: '2px' }}
          >
            수집 업적
          </p>
          <div className="grid grid-cols-4 gap-2">
            {MILESTONES.map((ms) => {
              const achieved = stats.collectionCount >= ms.count;
              return (
                <div key={ms.count} className="text-center py-2">
                  <div
                    className="text-xl mb-1"
                    style={{ filter: achieved ? 'none' : 'grayscale(1) opacity(0.3)' }}
                  >
                    {ms.icon}
                  </div>
                  <p
                    className="text-[10px] font-bold"
                    style={{ color: achieved ? 'var(--primary)' : 'var(--text-tertiary)' }}
                  >
                    {ms.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
