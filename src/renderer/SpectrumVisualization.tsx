import React, { useEffect, useRef } from 'react';
import './styles/spectrum.css';

interface SpectrumVisualizationProps {
  frequency: number | null;
}

const SpectrumVisualization: React.FC<SpectrumVisualizationProps> = ({
  frequency,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const plotLeft = 34;
    const plotRight = 12;
    const plotTop = 16;
    const plotBottom = 20;
    const plotWidth = width - plotLeft - plotRight;
    const plotHeight = height - plotTop - plotBottom;
    const maxFreq = 1000;

    ctx.fillStyle = '#0b2d1e';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(190, 228, 174, 0.48)';
    ctx.lineWidth = 1;
    [0, 250, 500, 750, 1000].forEach((tick) => {
      const x = plotLeft + (tick / maxFreq) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(x, plotTop);
      ctx.lineTo(x, plotTop + plotHeight);
      ctx.stroke();
    });

    [0, 20, 40].forEach((db) => {
      const y = plotTop + plotHeight - (db / 50) * plotHeight;
      ctx.beginPath();
      ctx.moveTo(plotLeft, y);
      ctx.lineTo(plotLeft + plotWidth, y);
      ctx.stroke();
    });

    ctx.fillStyle = '#b8d9ad';
    ctx.font = '13px sans-serif';
    ctx.fillText('dB', 9, 14);
    [0, 20, 40].forEach((db) => {
      const y = plotTop + plotHeight - (db / 50) * plotHeight + 4;
      ctx.fillText(String(db), 8, y);
    });

    ctx.fillText('0 Hz', plotLeft - 6, height - 4);
    ctx.fillText('200 Hz', plotLeft + plotWidth * 0.2 - 18, height - 4);
    ctx.fillText('400 Hz', plotLeft + plotWidth * 0.4 - 18, height - 4);
    ctx.fillText('600 Hz', plotLeft + plotWidth * 0.6 - 18, height - 4);
    ctx.fillText('800 Hz', plotLeft + plotWidth * 0.8 - 18, height - 4);
    ctx.fillText('1 kHz', plotLeft + plotWidth - 36, height - 4);

    ctx.strokeStyle = '#d8f25a';
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(plotLeft, plotTop + plotHeight * 0.42);
    ctx.lineTo(plotLeft + plotWidth, plotTop + plotHeight * 0.42);
    ctx.stroke();
    ctx.setLineDash([]);

    const baseFrequency = Math.max(42, Math.min(maxFreq, frequency ?? 98.82));
    const peaks = Array.from({ length: 54 }, (_, index) => {
      const harmonic = (index % 7) + 1;
      const spread = (index * 37) % 1000;
      const freq = index < 10 ? baseFrequency * harmonic : spread;
      const wrappedFreq = Math.max(8, Math.min(maxFreq, freq % maxFreq));
      const harmonicBoost = index < 10 ? 1 / Math.sqrt(harmonic) : 0.18 + ((index * 13) % 18) / 100;
      const jitter = 0.45 + ((index * 17) % 45) / 100;
      const level = Math.min(1, harmonicBoost * jitter);

      return { freq: wrappedFreq, level };
    });

    peaks.forEach(({ freq, level }, index) => {
      const x = plotLeft + (freq / maxFreq) * plotWidth;
      const barHeight = Math.max(3, level * plotHeight * 0.84);
      const y = plotTop + plotHeight - barHeight;

      ctx.fillStyle = index < 10 ? '#28ff00' : '#14d94d';
      ctx.fillRect(Math.round(x), Math.round(y), 3, Math.round(barHeight));
    });

    if (frequency !== null) {
      const x = plotLeft + (Math.min(frequency, maxFreq) / maxFreq) * plotWidth;

      ctx.strokeStyle = '#ff4a2f';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(x, plotTop);
      ctx.lineTo(x, plotTop + plotHeight);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [frequency]);

  return (
    <section className="spectrum-container">
      <div className="panel-title">Spectrum</div>
      <canvas
        ref={canvasRef}
        width={700}
        height={176}
        className="spectrum-canvas"
      />
    </section>
  );
};

export default SpectrumVisualization;
