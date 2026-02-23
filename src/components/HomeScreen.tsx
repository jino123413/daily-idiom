import React from 'react';
import { DailyQuestion, StageDefinition, StreakData } from '../types';
import BannerAd from './BannerAd';

const BANNER_AD_GROUP_ID = 'ait.v2.live.64408c06d9394388';

interface HomeScreenProps {
  question: DailyQuestion | null;
  stage: StageDefinition;
  questionNumber: number;
  questionsPerStage: number;
  totalStages: number;
  correctCount: number;
  streak: StreakData;
  collectionCount: number;
  totalIdioms: number;
  hintUnlocked: boolean;
  canMovePrevStage: boolean;
  canMoveNextStage: boolean;
  onMovePrevStage: () => void;
  onMoveNextStage: () => void;
  onSelectAnswer: (index: number) => void;
  onHint: () => void;
  onViewCollection: () => void;
  onViewStats: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  question,
  stage,
  questionNumber,
  questionsPerStage,
  totalStages,
  correctCount,
  streak,
  collectionCount,
  totalIdioms,
  hintUnlocked,
  canMovePrevStage,
  canMoveNextStage,
  onMovePrevStage,
  onMoveNextStage,
  onSelectAnswer,
  onHint,
  onViewCollection,
  onViewStats,
}) => {
  if (!question) {
    return (
      <div className="px-5 py-8 text-center">
        <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
          현재 등급 문제를 불러오지 못했어요.
        </p>
      </div>
    );
  }

  const { idiom, blankPos, options } = question;
  const hanjaChars = idiom.hanja.split('');
  const koreanChars = idiom.korean.split('');

  return (
    <div className="px-5 pb-8 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mt-1 mb-4">
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
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              stroke="var(--text-secondary)"
              strokeWidth="2"
            />
            <text
              x="12"
              y="16"
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize="10"
              fontWeight="bold"
              stroke="none"
            >
              印
            </text>
          </svg>
          {collectionCount}/{totalIdioms}
        </div>
      </div>

      <div className="scroll-card p-4 mb-4">
        <p
          className="text-center text-[11px] font-bold mb-2"
          style={{ color: 'var(--text-tertiary)', letterSpacing: '2px' }}
        >
          현재 등급
        </p>
        <p className="text-center text-[20px] font-bold mb-1" style={{ color: 'var(--hanja)' }}>
          {stage.title}
        </p>
        <p className="text-center text-[12px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          {stage.subtitle}
        </p>

        <div className="flex items-center justify-center gap-2 mb-2">
          <button
            onClick={onMovePrevStage}
            disabled={!canMovePrevStage}
            className="home-text-btn"
            style={{ opacity: canMovePrevStage ? 1 : 0.35 }}
          >
            이전 등급
          </button>
          <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            {stage.index + 1} / {totalStages}
          </span>
          <button
            onClick={onMoveNextStage}
            disabled={!canMoveNextStage}
            className="home-text-btn"
            style={{ opacity: canMoveNextStage ? 1 : 0.35 }}
          >
            다음 등급
          </button>
        </div>

        <div className="flex items-center justify-between mt-3 text-[12px]">
          <span style={{ color: 'var(--text-secondary)' }}>
            진행 {Math.min(questionNumber, questionsPerStage)}/{questionsPerStage}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            정답 {correctCount}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full mt-2" style={{ background: '#E7E5E4' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(Math.min(questionNumber - 1, questionsPerStage) / questionsPerStage) * 100}%`,
              background: 'var(--primary)',
            }}
          />
        </div>
      </div>

      <div className="scroll-card p-6 mb-5">
        <p
          className="text-center text-[11px] font-medium mb-5"
          style={{ color: 'var(--text-tertiary)', letterSpacing: '4px' }}
        >
          {questionNumber}번 문제
        </p>

        <div className="flex items-center justify-center gap-3 mb-3">
          {hanjaChars.map((char, i) => (
            <div key={i} className="animate-cell-pop" style={{ animationDelay: `${i * 0.08}s` }}>
              {i === blankPos ? (
                <div className="ink-blank w-[64px] h-[64px] flex items-center justify-center">
                  <span
                    className="text-[24px] font-bold"
                    style={{ color: 'var(--primary)', opacity: 0.4 }}
                  >
                    ?
                  </span>
                </div>
              ) : (
                <div className="w-[64px] h-[64px] flex items-center justify-center">
                  <span className="text-[38px] font-bold" style={{ color: 'var(--hanja)' }}>
                    {char}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-[17px] font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {koreanChars.map((char, i) => (
            <span
              key={i}
              style={i === blankPos ? { color: 'var(--primary)', fontWeight: 700 } : undefined}
            >
              {i === blankPos ? '?' : char}
            </span>
          ))}
        </p>

        <div className="brush-divider" />

        <p className="text-center text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {idiom.meaning}
        </p>

        {hintUnlocked && (
          <div className="mt-3 pt-3 animate-fade-in" style={{ borderTop: '1px dashed var(--scroll-border)' }}>
            <p
              className="text-center text-[11px] font-bold mb-1"
              style={{ color: 'var(--correct)', letterSpacing: '2px' }}
            >
              예문 힌트
            </p>
            <p className="text-center text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {idiom.example}
            </p>
          </div>
        )}
      </div>

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

      {!hintUnlocked && (
        <div className="text-center mb-4">
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

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <button
            onClick={onViewCollection}
            className="w-full seal-option py-3 text-[13px] font-bold flex items-center justify-center gap-1.5"
          >
            나의 인장함
            <span className="ad-badge-inline">AD</span>
          </button>
          <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
            광고 시청 후 이용 가능
          </p>
        </div>
        <div className="text-center">
          <button
            onClick={onViewStats}
            className="w-full seal-option py-3 text-[13px] font-bold flex items-center justify-center gap-1.5"
          >
            수련 기록
            <span className="ad-badge-inline">AD</span>
          </button>
          <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
            광고 시청 후 이용 가능
          </p>
        </div>
      </div>

      <div className="mt-5">
        <BannerAd adGroupId={BANNER_AD_GROUP_ID} />
      </div>
    </div>
  );
};

export default HomeScreen;
