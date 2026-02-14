import React from 'react';
import { ShieldIcon, FireIcon, CloseIcon, ArrowRightIcon } from './BrandIcons';

interface StreakShieldProps {
  streak: number;
  onWatch: () => void;
  onDismiss: () => void;
}

export const StreakShield: React.FC<StreakShieldProps> = ({ streak, onWatch, onDismiss }) => {
  return (
    <div className="streak-shield-overlay" onClick={onDismiss}>
      <div className="streak-shield-modal" onClick={(e) => e.stopPropagation()}>
        <button className="shield-close" onClick={onDismiss}>
          <CloseIcon size={20} color="var(--text-tertiary)" />
        </button>

        <div className="shield-icon">
          <ShieldIcon size={28} color="var(--primary)" />
        </div>

        <h3 className="shield-title">
          <span className="streak-count">{streak}일</span> 연속 수련을
          <br />지켜보세요!
        </h3>

        <p className="shield-description">
          어제 두루마리를 놓쳤지만, 광고를 시청하면
          <br />연속 기록을 유지할 수 있어요.
        </p>

        <div className="shield-streak-preview">
          <span className="streak-fire">
            <FireIcon size={16} color="var(--primary)" /> {streak}일
          </span>
          <ArrowRightIcon size={16} color="var(--text-tertiary)" />
          <span className="streak-danger">0일</span>
        </div>

        <button className="shield-btn" onClick={onWatch}>
          수련 기록 지키기
          <span className="ad-badge">AD</span>
        </button>

        <p className="ad-notice">광고 시청 후 어제 문제를 풀 수 있어요</p>
      </div>
    </div>
  );
};
