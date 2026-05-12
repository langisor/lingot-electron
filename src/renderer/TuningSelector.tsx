import React from 'react';
import { TUNINGS } from '../utils/tunings';
import './styles/selector.css';

interface TuningSelectorProps {
  selectedTuning: string;
  onChange: (tuning: string) => void;
}

const TuningSelector: React.FC<TuningSelectorProps> = ({
  selectedTuning,
  onChange,
}) => {
  return (
    <div className="tuning-selector">
      <label htmlFor="tuning-select">Select Tuning:</label>
      <select
        id="tuning-select"
        value={selectedTuning}
        onChange={(e) => onChange(e.target.value)}
      >
        {Object.entries(TUNINGS).map(([key, tuning]) => (
          <option key={key} value={key}>
            {tuning.name} - {tuning.description}
          </option>
        ))}
      </select>

      <div className="tuning-info">
        {TUNINGS[selectedTuning] && (
          <div className="tuning-notes">
            <strong>Notes:</strong> {TUNINGS[selectedTuning].notes.join(' - ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default TuningSelector;
