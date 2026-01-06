import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      if (!isActive) {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         // Draw a static line
         ctx.beginPath();
         ctx.moveTo(0, canvas.height / 2);
         ctx.lineTo(canvas.width, canvas.height / 2);
         ctx.strokeStyle = '#334155';
         ctx.stroke();
         return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.moveTo(0, centerY);

      // Create a waveform simulation
      for (let x = 0; x < width; x++) {
        const frequency = 0.05;
        // Combine a few sine waves for organic movement
        const y = centerY + 
          Math.sin(x * frequency + step) * 20 * Math.sin(step * 0.5) +
          Math.sin(x * frequency * 2 + step) * 10;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = '#EAB308'; // Gold color
      ctx.lineWidth = 2;
      ctx.stroke();

      step += 0.2;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive]);

  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={100} 
      className="w-full h-24 rounded-lg bg-slate-900/50 backdrop-blur-sm"
    />
  );
};

export default AudioVisualizer;
