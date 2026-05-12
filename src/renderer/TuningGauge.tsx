import React from 'react';
import './styles/gauge.css';

interface TuningGaugeProps {
  cents: number;
  isInTune: boolean;
}

const TuningGauge: React.FC<TuningGaugeProps> = ({ cents, isInTune }) => {
  const normalizedCents = Math.max(-50, Math.min(50, cents));
  const needleAngle = (normalizedCents / 50) * 62;

  return (
    <div className="gauge-container">
      <div className={`gauge ${isInTune ? 'in-tune' : 'out-of-tune'}`}>
        <div className="gauge-arc gauge-arc-outer" />
        <div className="gauge-arc gauge-arc-inner" />
        <div className="gauge-arc gauge-arc-ok" />

        <div className="gauge-marks">
          {[-50, -25, 0, 25, 50].map((mark) => {
            const angle = (mark / 50) * 62;

            return (
              <div
                key={mark}
                className={`gauge-mark ${mark === 0 ? 'center' : ''}`}
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <span>{mark > 0 ? `+${mark}` : mark}</span>
              </div>
            );
          })}
        </div>

        <div className="gauge-center-label">
          <span>cent</span>
        </div>
        <div
          className="gauge-needle"
          style={{ transform: `translateX(-50%) rotate(${needleAngle}deg)` }}
        />
        <div className="gauge-pivot" />

        <div className="gauge-zero">0</div>
      </div>

      <div className="status-indicator">
        {isInTune ? (
          <span className="in-tune-badge">in tune</span>
        ) : Math.abs(cents) < 20 ? (
          <span className="almost-badge">close</span>
        ) : (
          <span className="out-badge">out of tune</span>
        )}
      </div>
    </div>
  );
};

export default TuningGauge;
