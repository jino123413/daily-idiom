import React from 'react';
import { DailyQuestion, StreakData } from '../types';

interface HomeScreenProps {
  question: DailyQuestion;
  streak: StreakData;
  collectionCount: number;
  totalIdioms: number;
  hintUnlocked: boolean;
  onSelectAnswer: (index: number) => void;
  onHint: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  question,
  streak,
  collectionCount,
  totalIdioms,
  hintUnlocked,
  onSelectAnswer,
  onHint,
}) => {
  const { idiom, blankPos, options } = question;
  const hanjaChars = idiom.hanja.split('');
  const koreanChars = idiom.korean.split('');

  return (
    <div className="px-5 pb-8 animate-fade-in">
      {/* 서재 상태: 스트릭 + 수집 현황 */}
      <div className="flex items-center justify-center gap-3 mt-1 mb-5">
        {streak.currentStreak > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)">
              <path d="M12 2c1 4-4 6-4 10a6 6 0 0012 0c0-4-3-5-3-8-1 2-3 2-4 0s-1-4 1-6l-2 4z" />
            </svg>
            {streak.currentStreak}일째
          </div>
        )}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium"
          style={{ background: '#F5F5F4', color: 'var(--text-secondary)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--text-secondary)" strokeWidth="2" />
            <text x="12" y="16" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="bold" stroke="none">印</text>
          </svg>
          {collectionCount}/{totalIdioms}
        </div>
      </div>

      {/* 두루마리 — 오늘의 사자성어 (히어로, 주제 매칭: 서예 두루마리) */}
      <div className="scroll-card p-6 mb-5">
        <p
          className="text-center text-[11px] font-medium mb-5"
          style={{ color: 'var(--text-tertiary)', letterSpacing: '4px' }}
        >
          오늘의 두루마리
        </p>

        {/* 한자 4글자 — 비정형: 히어로 크기 */}
        <div className="flex items-center justify-center gap-3 mb-3">
          {hanjaChars.map((char, i) => (
            <div key={i} className="animate-cell-pop" style={{ animationDelay: `${i * 0.08}s` }}>
              {i === blankPos ? (
                <div className="ink-blank w-[64px] h-[64px] flex items-center justify-center">
                  <span className="text-[24px] font-bold" style={{ color: 'var(--primary)', opacity: 0.4 }}>?</span>
                </div>
              ) : (
                <div className="w-[64px] h-[64px] flex items-center justify-center">
                  <span className="text-[38px] font-bold" style={{ color: 'var(--hanja)' }}>{char}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 한국어 읽기 */}
        <p className="text-center text-[17px] font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {koreanChars.map((char, i) => (
            <span key={i} style={i === blankPos ? { color: 'var(--primary)', fontWeight: 700 } : undefined}>
              {i === blankPos ? '?' : char}
            </span>
          ))}
        </p>

        <div className="brush-divider" />

        {/* 뜻 힌트 — 두루마리 안에 통합 (정보 덩어리화) */}
        <p className="text-center text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {idiom.meaning}
        </p>

        {/* 예문 힌트 (AD 해금 시) */}
        {hintUnlocked && (
          <div className="mt-3 pt-3 animate-fade-in" style={{ borderTop: '1px dashed var(--scroll-border)' }}>
            <p className="text-center text-[11px] font-bold mb-1" style={{ color: 'var(--correct)', letterSpacing: '2px' }}>
              예문 힌트
            </p>
            <p className="text-center text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {idiom.example}
            </p>
          </div>
        )}
      </div>

      {/* 보기 — 인장 선택 */}
      <p className="text-center text-[12px] font-medium mb-3" style={{ color: 'var(--text-tertiary)' }}>
        빈칸에 들어갈 글자를 고르세요
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => onSelectAnswer(i)}
            className="seal-option px-3 py-4 text-center font-bold text-[15px]"
          >
            {option}
          </button>
        ))}
      </div>

      {/* 힌트 AD 버튼 + 사전 고지 */}
      {!hintUnlocked && (
        <div className="text-center">
          <button
            onClick={onHint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-95"
            style={{ background: '#F5F5F4', color: 'var(--text-secondary)' }}
          >
            예문 힌트 보기
            <span className="ad-badge-inline">AD</span>
          </button>
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
            광고 시청 후 예문을 미리 볼 수 있어요
          </p>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
