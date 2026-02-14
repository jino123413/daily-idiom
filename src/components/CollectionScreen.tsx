import React, { useState, useMemo } from 'react';
import { CollectionEntry, IdiomCategory, CATEGORY_LABELS } from '../types';
import { ALL_IDIOMS, getIdiomsByCategory } from '../utils/idiom-utils';
import { LockIcon } from './BrandIcons';

interface CollectionScreenProps {
  collection: CollectionEntry[];
}

const CATEGORIES: IdiomCategory[] = ['wisdom', 'study', 'relations', 'nature', 'emotion'];

const CollectionScreen: React.FC<CollectionScreenProps> = ({ collection }) => {
  const [activeCategory, setActiveCategory] = useState<IdiomCategory>('wisdom');
  const [selectedIdiomId, setSelectedIdiomId] = useState<number | null>(null);

  const collectedIds = useMemo(() => new Set(collection.map((c) => c.idiomId)), [collection]);

  const categoryIdioms = useMemo(
    () => getIdiomsByCategory(activeCategory),
    [activeCategory]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<IdiomCategory, { collected: number; total: number }> = {} as any;
    for (const cat of CATEGORIES) {
      const catIdioms = getIdiomsByCategory(cat);
      counts[cat] = {
        total: catIdioms.length,
        collected: catIdioms.filter((i) => collectedIds.has(i.id)).length,
      };
    }
    return counts;
  }, [collectedIds]);

  const selectedIdiom = useMemo(
    () => (selectedIdiomId !== null ? ALL_IDIOMS.find((i) => i.id === selectedIdiomId) : null),
    [selectedIdiomId]
  );

  const currentCat = categoryCounts[activeCategory];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header — 세계관: 인장함 (NO ← back button — 토스 네비바 사용) */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/85 text-center py-3.5">
        <h1 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          나의 인장함
        </h1>
        <p className="text-[12px] font-medium mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          {collection.length}종 수집
        </p>
      </header>

      {/* 카테고리 서랍 탭 */}
      <div className="px-4 pt-3 pb-1 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            const count = categoryCounts[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`drawer-tab ${isActive ? 'active' : ''}`}
              >
                {CATEGORY_LABELS[cat]}
                <span className="ml-1 text-[11px] opacity-60">
                  {count.collected}/{count.total}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 인장 진행 — 시각 도트 (비정형, 퍼센트 아닌 채움) */}
      <div className="px-5 py-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: Math.min(currentCat.total, 40) }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full"
              style={{
                background: i < currentCat.collected ? 'var(--stamp)' : '#E7E5E4',
                opacity: i < currentCat.collected ? 0.7 : 0.3,
                maxWidth: '8px',
              }}
            />
          ))}
        </div>
      </div>

      {/* 인장 그리드 — 4열 (세계관: 인장함의 인장들) */}
      <div className="px-4 pb-8 grid grid-cols-4 gap-2">
        {categoryIdioms.map((idiom) => {
          const isCollected = collectedIds.has(idiom.id);
          return (
            <button
              key={idiom.id}
              onClick={() => isCollected && setSelectedIdiomId(idiom.id)}
              disabled={!isCollected}
              className={`seal-tile ${isCollected ? 'collected' : 'locked'} active:scale-95`}
            >
              {isCollected ? (
                <>
                  <p
                    className="text-[15px] font-bold leading-none mb-0.5"
                    style={{ color: 'var(--hanja)' }}
                  >
                    {idiom.hanja.substring(0, 2)}
                  </p>
                  <p
                    className="text-[15px] font-bold leading-none"
                    style={{ color: 'var(--hanja)' }}
                  >
                    {idiom.hanja.substring(2, 4)}
                  </p>
                  {/* 수집 인장 마크 */}
                  <div
                    className="absolute top-1 right-1 w-2.5 h-2.5 rounded-sm"
                    style={{ background: 'var(--stamp)', opacity: 0.7 }}
                  />
                </>
              ) : (
                <>
                  <LockIcon size={18} color="var(--text-tertiary)" className="opacity-25" />
                  <p className="text-[9px] font-medium mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                    ???
                  </p>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* 상세 모달 — 두루마리 스타일 바텀시트 */}
      {selectedIdiom && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setSelectedIdiomId(null)}
        >
          <div
            className="w-full max-w-[420px] rounded-t-2xl animate-slide-up"
            style={{ background: '#FFFDF7' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mt-3 mb-4" />

            <div className="px-6 pb-6">
              {/* 한자 히어로 */}
              <div className="text-center mb-3">
                <p className="text-[34px] font-bold" style={{ color: 'var(--hanja)' }}>
                  {selectedIdiom.hanja}
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedIdiom.korean}
                </p>
              </div>

              <div className="brush-divider" />

              {/* 통합 정보 — 덩어리화 */}
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--primary)', letterSpacing: '2px' }}>
                    뜻
                  </p>
                  <p className="text-[14px] leading-relaxed">{selectedIdiom.meaning}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--text-tertiary)', letterSpacing: '2px' }}>
                    예문
                  </p>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {selectedIdiom.example}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold mb-1" style={{ color: '#A16207', letterSpacing: '2px' }}>
                    유래
                  </p>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {selectedIdiom.origin}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedIdiomId(null)}
                className="w-full rounded-xl py-3 mt-5 font-bold text-sm"
                style={{ background: '#F5F5F4', color: 'var(--text-secondary)' }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionScreen;
