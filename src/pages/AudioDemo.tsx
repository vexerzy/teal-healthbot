
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AudioVisualizer } from "@/components/audio/AudioVisualizer";
import { Play, Pause, RotateCcw } from "lucide-react";

const AudioDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-xl p-8 glass-panel">
        <h1 className="text-2xl font-bold text-center mb-8">Audio Visualizer Demo</h1>
        
        <div className="flex flex-col items-center gap-8">
          <AudioVisualizer 
            isAISpeaking={isPlaying} 
            audioRef={audioRef}
          />

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <audio 
            ref={audioRef}
            src="/demo-tts.mp3"
            onEnded={() => setIsPlaying(false)}
          />

          <p className="text-sm text-muted-foreground text-center">
            This is a demo of the audio visualizer using a pre-recorded TTS audio file.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AudioDemo;
