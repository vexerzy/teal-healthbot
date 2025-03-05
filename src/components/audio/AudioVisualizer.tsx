
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isAISpeaking: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const AudioVisualizer = ({ isAISpeaking, audioRef }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const sourceRef = useRef<MediaElementAudioSourceNode>();

  useEffect(() => {
    if (!canvasRef.current || !audioRef.current) {
      // If audio element is not available, just draw a static visualizer
      if (canvasRef.current) {
        drawStaticVisualizer();
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Set up audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      // Check if the audio element is available and has a valid source
      if (audioRef.current.src) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!ctx || !analyserRef.current) return;

        animationRef.current = requestAnimationFrame(draw);
        
        try {
          analyserRef.current.getByteFrequencyData(dataArray);
        } catch (error) {
          console.error("Error getting frequency data:", error);
          // Fall back to static visualization
          drawStaticVisualizer();
          return;
        }

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        for (let i = 0; i < bufferLength; i++) {
          const amplitude = dataArray[i] / 255; // Normalize to 0-1
          const angle = (i / bufferLength) * Math.PI * 2;
          const length = radius * (0.3 + amplitude * 0.7);

          const x1 = centerX + Math.cos(angle) * radius * 0.3;
          const y1 = centerY + Math.sin(angle) * radius * 0.3;
          const x2 = centerX + Math.cos(angle) * length;
          const y2 = centerY + Math.sin(angle) * length;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsl(${(i / bufferLength) * 360}, 80%, ${50 + amplitude * 50}%)`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      };

      draw();
    } catch (error) {
      console.error("Error setting up audio visualizer:", error);
      drawStaticVisualizer();
    }

    function drawStaticVisualizer() {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      for (let i = 0; i < 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const length = radius * (0.3 + (isAISpeaking ? Math.random() * 0.4 : 0.2));
        
        const x1 = centerX + Math.cos(angle) * radius * 0.3;
        const y1 = centerY + Math.sin(angle) * radius * 0.3;
        const x2 = centerX + Math.cos(angle) * length;
        const y2 = centerY + Math.sin(angle) * length;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsl(${(i / 64) * 360}, 80%, ${isAISpeaking ? 60 : 40}%)`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      if (isAISpeaking) {
        animationRef.current = requestAnimationFrame(drawStaticVisualizer);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (sourceRef.current && audioContextRef.current) {
        try {
          sourceRef.current.disconnect();
          audioContextRef.current.close();
        } catch (error) {
          console.error("Error cleaning up audio context:", error);
        }
      }
    };
  }, [isAISpeaking, audioRef]);

  return (
    <div className={`w-32 h-32 transition-opacity duration-300 ${isAISpeaking ? 'opacity-100' : 'opacity-40'}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};
