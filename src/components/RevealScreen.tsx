import React, { useEffect } from 'react';
import { DailyQuestion } from '../types';

interface RevealScreenProps {
  question: DailyQuestion;
  selectedIndex: number;
  isCorrect: boolean;
  onComplete: () => void;
}

const RevealScreen: React.FC<RevealScreenProps> = ({
  question,
  selectedIndex,
  isCorrect,
  onComplete,
}) => {
  const { idiom, blankPos } = question;
  const hanjaChars = idiom.hanja.split('');

  useEffect(() => {
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`min-h-[70vh] flex flex-col items-center justify-center px-5 ${
        isCorrect ? 'animate-correct-flash' : 'animate-wrong-flash'
      }`}
    >
      {/* 한자 4글자 — 빈칸에 붓글씨 채우기 */}
      <div className={`flex items-center gap-3 mb-4 ${!isCorrect ? 'animate-shake' : ''}`}>
        {hanjaChars.map((char, i) => (
          <div key={i} className="relative">
            <div
              className={`w-[68px] h-[68px] flex items-center justify-center rounded-lg text-[42px] font-bold ${
                i === blankPos ? 'animate-brush' : ''
              }`}
              style={{
                color: i === blankPos
                  ? (isCorrect ? 'var(--correct)' : 'var(--wrong)')
                  : 'var(--hanja)',
              }}
            >
              {char}
            </div>
          </div>
        ))}
      </div>

      {/* 한국어 읽기 */}
      <p
        className="text-xl font-bold mb-5 animate-fade-in"
        style={{ color: 'var(--text-primary)', animationDelay: '0.3s' }}
      >
        {idiom.korean}
      </p>

      {/* 인장 스탬프 (정답 — 수집 의식) */}
      {isCorrect && (
        <div className="animate-stamp" style={{ animationDelay: '0.4s' }}>
          <div className="stamp-mark px-4 py-2 text-[20px]">
            收集
          </div>
        </div>
      )}

      {/* 내러티브 텍스트 — 세계관 (묵향서재) */}
      <div className="animate-fade-in mt-6 text-center" style={{ animationDelay: '0.6s' }}>
        {isCorrect ? (
          <p
            className="text-[15px] font-medium leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            오늘의 한 수를 얻었습니다
          </p>
        ) : (
          <>
            <p
              className="text-[15px] font-medium mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              다음 기회를 기다려 주세요
            </p>
            <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
              정답: {hanjaChars[blankPos]}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RevealScreen;
