
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AudioVisualizer } from "@/components/audio/AudioVisualizer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AudioDemo = () => {
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playDemoAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    console.log("Starting to play demo audio");
    const audio = new Audio("/demo-tts.mp3");
    audioRef.current = audio;
    setIsAISpeaking(true);
    
    audio.onended = () => {
      console.log("Audio playback ended");
      setIsAISpeaking(false);
    };

    audio.onerror = (error) => {
      console.error("Audio error:", error);
      toast.error("Error playing audio: Could not load the audio file");
      setIsAISpeaking(false);
    };

    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast.error(`Error playing audio: ${error.message}`);
      setIsAISpeaking(false);
    });
  };

  // Add a cleanup function
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-4xl p-8 glass-panel">
        <h1 className="text-3xl font-bold mb-6 text-center">Audio Test Page</h1>
        
        <div className="flex flex-col items-center justify-center mb-8 h-80">
          <AudioVisualizer 
            isAISpeaking={isAISpeaking}
            audioRef={audioRef}
          />
          {isAISpeaking && <p className="mt-4 text-primary animate-pulse">Audio is playing...</p>}
          {!isAISpeaking && <p className="mt-4 text-muted-foreground">Click the button below to play test audio</p>}
        </div>

        <div className="space-y-4">
          <Button 
            onClick={playDemoAudio}
            disabled={isLoading || isAISpeaking}
            className="w-full"
          >
            {isLoading ? "Loading..." : "Play Test Audio"}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Status: {isAISpeaking ? "Playing audio" : "Ready"}</p>
            <p className="mt-2">
              If you don't hear anything, please check your speakers and make sure your browser allows audio playback.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AudioDemo;
