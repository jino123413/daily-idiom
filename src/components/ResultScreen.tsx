import React, { useState, useEffect } from 'react';
import { DailyQuestion, DailyRecord } from '../types';
import { ShareIcon } from './BrandIcons';

interface ResultScreenProps {
  question: DailyQuestion;
  record: DailyRecord;
  collectionCount: number;
  totalIdioms: number;
  onViewCollection: () => void;
  onViewStats: () => void;
}

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  question,
  record,
  collectionCount,
  totalIdioms,
  onViewCollection,
  onViewStats,
}) => {
  const { idiom } = question;
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getTimeUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = async () => {
    try {
      const { share } = await import('@apps-in-toss/web-framework');
      await share({
        text: `오늘의 사자성어: ${idiom.hanja} (${idiom.korean})\n${idiom.meaning}\n\n나도 풀어보기 → 사자성어 한 수`,
      });
    } catch {
      try {
        await navigator.clipboard.writeText(
          `오늘의 사자성어: ${idiom.hanja} (${idiom.korean}) - ${idiom.meaning}`
        );
      } catch {}
    }
  };

  // 수집 진행을 인장 도트로 시각화 (비정형 — 시각 메타포)
  const filledStamps = Math.min(10, Math.floor((collectionCount / totalIdioms) * 10));

  return (
    <div className="px-5 pb-8 animate-fade-in">
      {/* 통합 두루마리 — 정보 덩어리화 (뜻+예문+유래 하나의 스크롤) */}
      <div className="result-scroll mb-5">
        {/* 수집 인장 / 미수집 표시 */}
        <div className="flex justify-center mb-4">
          {record.isCorrect ? (
            <div className="stamp-mark px-3 py-1 text-[13px]">收集</div>
          ) : (
            <span
              className="text-[12px] font-bold px-3 py-1 rounded"
              style={{ background: '#F5F5F4', color: 'var(--text-tertiary)' }}
            >
              미수집
            </span>
          )}
        </div>

        {/* 한자 히어로 — 비정형 배치: 가장 크게 */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {idiom.hanja.split('').map((char, i) => (
            <span key={i} className="text-[42px] font-bold" style={{ color: 'var(--hanja)' }}>
              {char}
            </span>
          ))}
        </div>

        {/* 한국어 읽기 */}
        <p className="text-center text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {idiom.korean}
        </p>

        <div className="brush-divider" />

        {/* 뜻 — 두루마리 내 연속 흐름 */}
        <div className="mb-4">
          <p className="text-[11px] font-bold mb-1.5" style={{ color: 'var(--primary)', letterSpacing: '2px' }}>
            뜻
          </p>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {idiom.meaning}
          </p>
        </div>

        {/* 예문 — 같은 두루마리 안 */}
        <div className="mb-4">
          <p className="text-[11px] font-bold mb-1.5" style={{ color: 'var(--text-tertiary)', letterSpacing: '2px' }}>
            예문
          </p>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {idiom.example}
          </p>
        </div>

        {/* 유래 — 같은 두루마리 안 */}
        <div>
          <p className="text-[11px] font-bold mb-1.5" style={{ color: '#A16207', letterSpacing: '2px' }}>
            유래
          </p>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {idiom.origin}
          </p>
        </div>
      </div>

      {/* 수집 진행 — 인장 도트 (시각 메타포, 퍼센트 아닌 도장 수) */}
      <div className="flex items-center justify-center gap-1.5 mb-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm transition-all"
            style={{
              background: i < filledStamps ? 'var(--stamp)' : '#E7E5E4',
              opacity: i < filledStamps ? 0.8 : 0.35,
            }}
          />
        ))}
        <span className="ml-2 text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
          {collectionCount}/{totalIdioms}
        </span>
      </div>

      {/* 공유 버튼 */}
      <button
        onClick={handleShare}
        className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 font-bold text-[14px] mb-4 transition-all active:scale-[0.98]"
        style={{ background: 'var(--text-primary)', color: 'white' }}
      >
        <ShareIcon size={15} color="white" />
        오늘의 사자성어 공유
      </button>

      {/* 카운트다운 — 다음 두루마리까지 */}
      <div className="text-center mb-5">
        <p className="text-[11px] mb-1" style={{ color: 'var(--text-tertiary)' }}>
          다음 두루마리까지
        </p>
        <p className="text-[18px] font-bold tabular-nums" style={{ color: 'var(--text-secondary)' }}>
          {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
        </p>
      </div>

      {/* 부가 기능 버튼 — AD 배지 + 사전 고지 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <button
            onClick={onViewCollection}
            className="w-full seal-option py-3.5 font-bold text-[13px] flex items-center justify-center gap-1.5"
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
            className="w-full seal-option py-3.5 font-bold text-[13px] flex items-center justify-center gap-1.5"
          >
            수련 기록
            <span className="ad-badge-inline">AD</span>
          </button>
          <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
            광고 시청 후 이용 가능
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
