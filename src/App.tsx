import React, { useState, useCallback, useEffect } from 'react';
import { Screen } from './types';
import { DeviceViewport } from './components/DeviceViewport';
import { useDailyIdiomState } from './hooks/useDailyIdiomState';
import { useInterstitialAd } from './hooks/useInterstitialAd';
import { getDailyIdiom, ALL_IDIOMS } from './utils/idiom-utils';
import { getTodayString, getYesterdayString } from './utils/date-utils';
import HomeScreen from './components/HomeScreen';
import RevealScreen from './components/RevealScreen';
import ResultScreen from './components/ResultScreen';
import CollectionScreen from './components/CollectionScreen';
import StatsScreen from './components/StatsScreen';
import { StreakShield } from './components/StreakShield';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const {
    todayRecord,
    streak,
    collection,
    stats,
    records,
    hintUnlocked,
    yesterdayMode,
    showStreakShield,
    submitAnswer,
    handleUnlockHint,
    handleStreakShield,
    dismissStreakShield,
    setYesterdayMode,
  } = useDailyIdiomState();

  const { showAd } = useInterstitialAd();

  const dateStr = yesterdayMode ? getYesterdayString() : getTodayString();
  const question = getDailyIdiom(dateStr);

  // Init: check if already answered today
  useEffect(() => {
    if (todayRecord && !yesterdayMode) {
      setScreen('result');
    }
  }, [todayRecord, yesterdayMode]);

  // 토스 네비바 뒤로가기 지원 — history 기반 (← 버튼 제거 대신)
  useEffect(() => {
    const handlePopState = () => {
      if (screen === 'collection' || screen === 'stats') {
        setScreen('result');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [screen]);

  const handleSelectAnswer = useCallback(
    (index: number) => {
      if (!question) return;
      const correct = index === question.correctIndex;
      setSelectedIndex(index);
      setIsCorrect(correct);
      submitAnswer(dateStr, question.idiom.id, index, correct);
      setScreen('reveal');
    },
    [question, submitAnswer, dateStr]
  );

  const handleRevealComplete = useCallback(() => {
    if (yesterdayMode) {
      setYesterdayMode(false);
    }
    setScreen('result');
  }, [yesterdayMode, setYesterdayMode]);

  const handleHint = useCallback(() => {
    showAd({
      onDismiss: () => handleUnlockHint(),
    });
  }, [showAd, handleUnlockHint]);

  const handleViewCollection = useCallback(() => {
    showAd({
      onDismiss: () => {
        window.history.pushState({ screen: 'collection' }, '');
        setScreen('collection');
      },
    });
  }, [showAd]);

  const handleViewStats = useCallback(() => {
    showAd({
      onDismiss: () => {
        window.history.pushState({ screen: 'stats' }, '');
        setScreen('stats');
      },
    });
  }, [showAd]);

  const handleStreakShieldAd = useCallback(() => {
    dismissStreakShield();
    showAd({
      onDismiss: () => {
        handleStreakShield();
      },
    });
  }, [showAd, handleStreakShield, dismissStreakShield]);

  // 메인 화면(home/reveal/result)에만 공통 헤더 표시
  const showHeader = screen === 'home' || screen === 'result' || screen === 'reveal';

  return (
    <>
      <DeviceViewport />
      <div className="min-h-screen font-gmarket" style={{ background: 'var(--bg)' }}>
        {/* 공통 헤더 — 세계관: 묵향서재 */}
        {showHeader && (
          <header className="sticky top-0 z-50 text-center py-3.5 backdrop-blur-lg bg-white/85">
            <h1 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              오늘의 사자성어
            </h1>
          </header>
        )}

        {/* Main Content */}
        <main className={showHeader ? 'pt-1' : ''}>
          {screen === 'home' && (
            <HomeScreen
              question={question}
              streak={streak}
              collectionCount={collection.length}
              totalIdioms={ALL_IDIOMS.length}
              hintUnlocked={hintUnlocked}
              onSelectAnswer={handleSelectAnswer}
              onHint={handleHint}
            />
          )}

          {screen === 'reveal' && selectedIndex !== null && (
            <RevealScreen
              question={question}
              selectedIndex={selectedIndex}
              isCorrect={isCorrect}
              onComplete={handleRevealComplete}
            />
          )}

          {screen === 'result' && (
            <ResultScreen
              question={yesterdayMode ? getDailyIdiom(getYesterdayString()) : question}
              record={todayRecord || { date: dateStr, idiomId: question.idiom.id, isCorrect, selectedIndex: selectedIndex || 0 }}
              collectionCount={collection.length}
              totalIdioms={ALL_IDIOMS.length}
              onViewCollection={handleViewCollection}
              onViewStats={handleViewStats}
            />
          )}

          {screen === 'collection' && (
            <CollectionScreen collection={collection} />
          )}

          {screen === 'stats' && stats && (
            <StatsScreen
              streak={streak}
              stats={stats}
              records={records}
            />
          )}
        </main>
      </div>

      {/* Streak Shield Modal */}
      {showStreakShield && (
        <StreakShield
          streak={streak.currentStreak}
          onWatch={handleStreakShieldAd}
          onDismiss={dismissStreakShield}
        />
      )}
    </>
  );
};

export default App;
