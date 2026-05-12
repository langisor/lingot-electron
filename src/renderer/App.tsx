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
  const detectedNote = note ? `${note.note}${note.octave}` : '-';
  const idleTargetLabel = TUNINGS[selectedTuning]?.notes[0] ?? '-';
  const idleTarget = parseNoteLabel(idleTargetLabel);
  const idleFrequency = idleTarget ? noteToFrequency(idleTarget.note, idleTarget.octave) : null;
  const displayFrequency = frequency ?? target?.frequency ?? idleFrequency;
  const toneLabel = target?.label ?? (frequency !== null ? detectedNote : idleTargetLabel);
  const toneNote = toneLabel.slice(0, -1) || '-';
  const toneOctave = toneLabel.length > 1 ? toneLabel.slice(-1) : '';

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
      <div className="window-shell">
        <header className="app-titlebar">
          <div className="window-dot" aria-hidden="true" />
          <div className="window-title">lingot</div>
          <button className="window-close" type="button" aria-label="Close preview">
            x
          </button>
        </header>

        <nav className="app-menu" aria-label="Application menu">
          <button type="button">File</button>
          <button type="button">Edit</button>
          <button type="button">View</button>
          <button type="button">Help</button>
        </nav>

        <main className="app-main">
          <section className="meter-row">
            <div className="classic-panel deviation-panel">
              <div className="panel-title">Deviation</div>
              <TuningGauge
                cents={cents}
                isInTune={isInTune}
              />
            </div>

            <div className="classic-panel tone-panel">
              <div className="panel-title">Tone</div>
              <div className="tone-frequency">
                f = {displayFrequency !== null ? displayFrequency.toFixed(2) : '--'} Hz
              </div>
              <div className="tone-note">
                {toneNote}
                <sub>{toneOctave}</sub>
              </div>
              <div className="tone-cents">
                {detectedNote.toLowerCase()} = {cents > 0 ? '+' : ''}{cents} cents
              </div>
            </div>
          </section>

          <SpectrumVisualization frequency={frequency} />

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
                  Start
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={stopListening}
                >
                  Stop
                </button>
              )}
            </div>

            <div className="string-strip" aria-label="Tuning targets">
              {TUNINGS[selectedTuning].notes.map((stringNote) => (
                <div
                  key={stringNote}
                  className={`string-chip ${stringNote === target?.label ? 'active' : ''}`}
                >
                  {stringNote}
                </div>
              ))}
            </div>

            <div className={`listen-status ${isListening ? 'listening' : ''}`}>
              {isListening
                ? frequency === null
                  ? 'Waiting for a clear pitch'
                  : `Tracking ${detectedNote}`
                : 'Microphone idle'}
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
