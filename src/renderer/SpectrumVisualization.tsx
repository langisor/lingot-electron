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

    // Draw simple frequency spectrum
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw frequency line
    if (frequency !== null) {
      const maxFreq = 5000;
      const x = (frequency / maxFreq) * width;

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(0, 255, 136, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 255, 136, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, x, height);

      // Frequency line
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Frequency label
      ctx.fillStyle = '#00ff88';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`${frequency.toFixed(0)} Hz`, x + 10, 30);
    }

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const x = (i / 5) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '12px monospace';
      ctx.fillText(`${Math.round((i / 5) * 5000)} Hz`, x + 5, 15);
    }
  }, [frequency]);

  return (
    <section className="spectrum-container">
      <h3>Frequency Spectrum</h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={150}
        className="spectrum-canvas"
      />
    </section>
  );
};

export default SpectrumVisualization;
