/**
 * FFT-based frequency detection using Web Audio API
 * Adapted from LINGOT's signal processing core
 */

const SAMPLE_RATE = 44100;

export class FrequencyDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private fftSize = 4096;

  async initialize(): Promise<boolean> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = 0.8;

      const dataArrayLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(dataArrayLength);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);

      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }

  /**
   * Detect the dominant frequency using FFT
   */
  detectFrequency(): number | null {
    if (!this.analyser || !this.dataArray) return null;

    this.analyser.getByteFrequencyData(this.dataArray as any);

    let maxValue = 0;
    let maxIndex = 0;

    for (let i = 0; i < this.dataArray.length; i++) {
      if (this.dataArray[i] > maxValue) {
        maxValue = this.dataArray[i];
        maxIndex = i;
      }
    }

    const nyquist = (this.audioContext?.sampleRate || SAMPLE_RATE) / 2;
    const frequency = (maxIndex * nyquist) / this.dataArray.length;

    return maxValue > 30 ? frequency : null;
  }

  /**
   * Get frequency in real-time with smoothing
   */
  getSmoothedFrequency(): number | null {
    const freq = this.detectFrequency();
    return freq;
  }

  stop(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

/**
 * Musical note utilities
 */
export const NOTES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

const A4_FREQUENCY = 440;
const A4_MIDI = 69;

export function frequencyToNote(frequency: number): {
  note: string;
  octave: number;
  cents: number;
} {
  const semitone = 12 * Math.log2(frequency / A4_FREQUENCY);
  const midi = Math.round(A4_MIDI + semitone);
  const cents = Math.round((semitone - Math.round(semitone)) * 100);

  const noteIndex = ((midi - 12) % 12 + 12) % 12;
  const octave = Math.floor((midi - 12) / 12);

  return {
    note: NOTES[noteIndex],
    octave,
    cents,
  };
}

export function noteToFrequency(note: string, octave: number): number {
  const noteIndex = NOTES.indexOf(note.toUpperCase());
  if (noteIndex === -1) return 0;

  const semitones = (octave + 1) * 12 + noteIndex - A4_MIDI;
  return A4_FREQUENCY * Math.pow(2, semitones / 12);
}
