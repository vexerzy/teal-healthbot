
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
    if (!canvasRef.current) {
      console.error("Canvas ref is not available");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get 2D context from canvas");
      return;
    }

    // Use blue flame colors
    const blueColors = [
      '#0EA5E9', // Ocean blue
      '#38BDF8', // Sky blue
      '#7DD3FC', // Light blue
      '#BAE6FD', // Lighter blue
      '#0C4A6E'  // Dark blue
    ];

    // Always draw the flame visualizer first
    drawFlameVisualizer();

    // Only try to set up the audio analyzer if we have a valid audio element with a source
    if (audioRef.current && audioRef.current.src) {
      try {
        console.log("Setting up audio visualizer with audio source:", audioRef.current.src);
        
        // Set up audio context
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        // Connect the audio element to the analyzer
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const drawAnimatedFlame = () => {
          if (!ctx || !analyserRef.current) return;

          animationRef.current = requestAnimationFrame(drawAnimatedFlame);
          
          try {
            analyserRef.current.getByteFrequencyData(dataArray);
          } catch (error) {
            console.error("Error getting frequency data:", error);
            // Fall back to static visualization
            drawFlameVisualizer();
            return;
          }

          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(centerX, centerY) * 0.8;

          // Create flame effect
          for (let i = 0; i < bufferLength; i++) {
            const amplitude = dataArray[i] / 255; // Normalize to 0-1
            const angle = (i / bufferLength) * Math.PI * 2;
            
            // Add some randomness to create flickering effect
            const flickerAmount = Math.random() * 0.2;
            const length = radius * (0.3 + (amplitude + flickerAmount) * 0.7);

            const x1 = centerX + Math.cos(angle) * radius * 0.3;
            const y1 = centerY + Math.sin(angle) * radius * 0.3;
            const x2 = centerX + Math.cos(angle) * length;
            const y2 = centerY + Math.sin(angle) * length;

            // Create gradient for each flame line
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, blueColors[Math.floor(Math.random() * 3) + 2]); // Inner color (lighter)
            gradient.addColorStop(1, blueColors[Math.floor(Math.random() * 2)]); // Outer color (darker)

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        };

        drawAnimatedFlame();
      } catch (error) {
        console.error("Error setting up audio visualizer:", error);
        // If setup fails, just use the static visualizer
        drawFlameVisualizer();
      }
    } else {
      console.log("Audio element not ready, using static visualizer");
      // No audio element with valid source, use static visualizer
      if (isAISpeaking) {
        animationRef.current = requestAnimationFrame(drawFlameVisualizer);
      }
    }

    function drawFlameVisualizer() {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Flame effect with blue colors
      for (let i = 0; i < 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        
        // Add randomness for flickering effect
        const flickerAmount = isAISpeaking ? Math.random() * 0.4 : 0;
        const length = radius * (0.3 + (isAISpeaking ? Math.random() * 0.4 + flickerAmount : 0.2));
        
        const x1 = centerX + Math.cos(angle) * radius * 0.3;
        const y1 = centerY + Math.sin(angle) * radius * 0.3;
        const x2 = centerX + Math.cos(angle) * length;
        const y2 = centerY + Math.sin(angle) * length;
        
        // Create gradient for each flame line
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, blueColors[3]); // Inner color (lighter)
        gradient.addColorStop(1, blueColors[isAISpeaking ? 0 : 4]); // Outer color
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      if (isAISpeaking) {
        animationRef.current = requestAnimationFrame(drawFlameVisualizer);
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
    <div className={`w-32 h-32 transition-opacity duration-300 ${isAISpeaking ? 'opacity-100' : 'opacity-60'}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};
