import React from 'react';
import './styles/gauge.css';

interface TuningGaugeProps {
  cents: number;
  isInTune: boolean;
}

const TuningGauge: React.FC<TuningGaugeProps> = ({ cents, isInTune }) => {
  const normalizedCents = Math.max(-50, Math.min(50, cents));
  const percentage = ((normalizedCents + 50) / 100) * 100;

  return (
    <div className="gauge-container">
      <div className={`gauge ${isInTune ? 'in-tune' : 'out-of-tune'}`}>
        <div className="gauge-scale">
          {[-50, -25, 0, 25, 50].map((mark) => (
            <div
              key={mark}
              className={`gauge-mark ${mark === 0 ? 'center' : ''}`}
              style={{ left: `${((mark + 50) / 100) * 100}%` }}
            >
              {mark}
            </div>
          ))}
        </div>

        <div
          className="gauge-needle"
          style={{ left: `${percentage}%` }}
        />

        <div className="gauge-label">Cents</div>
      </div>

      <div className="status-indicator">
        {isInTune ? (
          <span className="in-tune-badge">✓ IN TUNE</span>
        ) : Math.abs(cents) < 20 ? (
          <span className="almost-badge">⚠ CLOSE</span>
        ) : (
          <span className="out-badge">✗ OUT OF TUNE</span>
        )}
      </div>
    </div>
  );
};

export default TuningGauge;
