import React, { useEffect, useRef, useState } from 'react';
import { FrequencyDetector, frequencyToNote, noteToFrequency } from '../utils/audio';
import { TUNINGS } from '../utils/tunings';
import TuningGauge from './TuningGauge';
import TuningSelector from './TuningSelector';
import SpectrumVisualization from './SpectrumVisualization';
import './styles/app.css';

interface TuningTarget {
  label: string;
  frequency: number;
  cents: number;
}

const parseNoteLabel = (label: string): { note: string; octave: number } | null => {
  const match = label.match(/^([A-G]#?)(-?\d+)$/);

  if (!match) {
    return null;
  }

  return {
    note: match[1],
    octave: Number(match[2]),
  };
};

const getClosestTuningTarget = (
  detectedFrequency: number,
  tuningKey: string
): TuningTarget | null => {
  const tuning = TUNINGS[tuningKey];

  if (!tuning) {
    return null;
  }

  return tuning.notes.reduce<TuningTarget | null>((closest, noteLabel) => {
    const parsed = parseNoteLabel(noteLabel);

    if (!parsed) {
      return closest;
    }

    const targetFrequency = noteToFrequency(parsed.note, parsed.octave);

    if (targetFrequency <= 0) {
      return closest;
    }

    const cents = Math.round(1200 * Math.log2(detectedFrequency / targetFrequency));
    const target = {
      label: noteLabel,
      frequency: targetFrequency,
      cents,
    };

    if (!closest || Math.abs(target.cents) < Math.abs(closest.cents)) {
      return target;
    }

    return closest;
  }, null);
};

const App: React.FC = () => {
  const [frequency, setFrequency] = useState<number | null>(null);
  const [note, setNote] = useState<{ note: string; octave: number; cents: number } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [selectedTuning, setSelectedTuning] = useState('standard_guitar');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const detectorRef = useRef<FrequencyDetector | null>(null);
  const animationRef = useRef<number | null>(null);
  const target = frequency !== null ? getClosestTuningTarget(frequency, selectedTuning) : null;
  const cents = target?.cents ?? note?.cents ?? 0;
  const isInTune = Math.abs(cents) < 5;
  const tuningDirection = cents > 0 ? 'Tune down' : cents < 0 ? 'Tune up' : 'Hold steady';

  useEffect(() => {
    const detector = new FrequencyDetector();
    detectorRef.current = detector;

    return () => {
      if (detectorRef.current) {
        detectorRef.current.stop();
      }
    };
  }, []);

  const startListening = async () => {
    if (!detectorRef.current) return;

    const initialized = await detectorRef.current.initialize();
    if (!initialized) {
      setErrorMessage('Could not access the microphone. Check permissions and try again.');
      return;
    }

    setErrorMessage(null);
    setIsListening(true);

    const updateFrequency = () => {
      const freq = detectorRef.current?.getSmoothedFrequency();

      if (freq !== null && freq !== undefined) {
        setFrequency(freq);
        setNote(frequencyToNote(freq));
      }

      animationRef.current = requestAnimationFrame(updateFrequency);
    };

    updateFrequency();
  };

  const stopListening = () => {
    setIsListening(false);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    if (detectorRef.current) {
      detectorRef.current.stop();
      detectorRef.current = new FrequencyDetector();
    }
    setFrequency(null);
    setNote(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎸 Lingot Tuner</h1>
        <p>Accurate Musical Instrument Tuner</p>
      </header>

      <main className="app-main">
        <section className={`status-panel ${isListening ? 'listening' : ''}`}>
          <div>
            <span className="status-kicker">{isListening ? 'Listening' : 'Ready'}</span>
            <h2>{isListening ? 'Play one string at a time' : 'Choose a tuning and start'}</h2>
          </div>
          <div className="status-light" aria-hidden="true" />
        </section>

        <section className="control-panel">
          <TuningSelector
            selectedTuning={selectedTuning}
            onChange={setSelectedTuning}
          />

          <div className="button-group">
            {!isListening ? (
              <button
                className="btn btn-primary"
                onClick={startListening}
              >
                Start Tuning
              </button>
            ) : (
              <button
                className="btn btn-danger"
                onClick={stopListening}
              >
                Stop Listening
              </button>
            )}
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </section>

        {isListening && frequency !== null && note !== null && target !== null && (
          <>
            <section className="display-panel">
              <div className="frequency-display">
                <div className="target-label">Closest string: {target.label}</div>
                <div className="note-display">
                  {note.note}{note.octave}
                  {cents > 0 && <span className="cents">+{cents}</span>}
                  {cents < 0 && <span className="cents">{cents}</span>}
                </div>
                <div className="frequency-value">{frequency.toFixed(1)} Hz</div>
                <div className="target-frequency">
                  Target {target.frequency.toFixed(1)} Hz | {tuningDirection}
                </div>
              </div>

              <TuningGauge
                cents={cents}
                isInTune={isInTune}
              />

              <div className="string-strip" aria-label="Tuning targets">
                {TUNINGS[selectedTuning].notes.map((stringNote) => (
                  <div
                    key={stringNote}
                    className={`string-chip ${stringNote === target.label ? 'active' : ''}`}
                  >
                    {stringNote}
                  </div>
                ))}
              </div>
            </section>

            <SpectrumVisualization frequency={frequency} />
          </>
        )}

        {isListening && frequency === null && (
          <section className="listening-empty">
            Waiting for a clear pitch...
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>LINGOT - Free and accurate musical instrument tuner</p>
      </footer>
    </div>
  );
};

export default App;
