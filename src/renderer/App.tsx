import React, { useEffect, useRef, useState } from 'react';
import { FrequencyDetector, frequencyToNote } from '../utils/audio';
import TuningGauge from './TuningGauge';
import TuningSelector from './TuningSelector';
import SpectrumVisualization from './SpectrumVisualization';
import './styles/app.css';

const App: React.FC = () => {
  const [frequency, setFrequency] = useState<number | null>(null);
  const [note, setNote] = useState<{ note: string; octave: number; cents: number } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [selectedTuning, setSelectedTuning] = useState('standard_guitar');
  const detectorRef = useRef<FrequencyDetector | null>(null);
  const animationRef = useRef<number | null>(null);

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
      alert('Could not access microphone. Check permissions.');
      return;
    }

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
        </section>

        {isListening && frequency !== null && note !== null && (
          <>
            <section className="display-panel">
              <div className="frequency-display">
                <div className="frequency-value">{frequency.toFixed(1)} Hz</div>
                <div className="note-display">
                  {note.note}{note.octave}
                  {note.cents > 0 && <span className="cents">+{note.cents}</span>}
                  {note.cents < 0 && <span className="cents">{note.cents}</span>}
                </div>
              </div>

              <TuningGauge
                cents={note.cents}
                isInTune={Math.abs(note.cents) < 5}
              />
            </section>

            <SpectrumVisualization frequency={frequency} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>LINGOT - Free and accurate musical instrument tuner</p>
      </footer>
    </div>
  );
};

export default App;
