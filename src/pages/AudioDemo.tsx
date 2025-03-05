
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AudioVisualizer } from "@/components/audio/AudioVisualizer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AudioDemo = () => {
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = "/demo-tts.mp3";

  // Pre-load audio file to check if it's valid
  useEffect(() => {
    console.log("Testing audio file at:", audioUrl);
    const testAudio = new Audio(audioUrl);
    
    testAudio.addEventListener('canplaythrough', () => {
      console.log("✅ Audio file is valid and can be played");
      setAudioError(null);
    });
    
    testAudio.addEventListener('error', (e) => {
      const errorDetails = testAudio.error 
        ? `Code: ${testAudio.error.code}, Message: ${testAudio.error.message || 'Unknown'}`
        : 'Unknown error';
      
      console.error("❌ Error pre-loading audio file:", errorDetails);
      setAudioError(`Audio file error: ${errorDetails}`);
      toast.error("There was an issue with the audio file");
    });
    
    return () => {
      testAudio.pause();
      testAudio.src = "";
    };
  }, []);

  const playDemoAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsLoading(true);
    setAudioError(null);
    console.log("Starting to play demo audio from:", audioUrl);

    try {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      // Debug info about the audio file
      console.log("Audio element created:", audio);
      console.log("Audio source:", audio.src);
      
      audio.oncanplaythrough = () => {
        console.log("Audio can play through, ready to start playback");
        setIsLoading(false);
        setIsAISpeaking(true);
        
        audio.play().catch(error => {
          console.error("Error during audio play():", error);
          toast.error(`Cannot play audio: ${error.message}`);
          setIsAISpeaking(false);
          setIsLoading(false);
          setAudioError(`Play error: ${error.message}`);
        });
      };
      
      audio.onended = () => {
        console.log("Audio playback ended");
        setIsAISpeaking(false);
      };

      audio.onerror = () => {
        const errorMessage = audio.error 
          ? `Error: ${audio.error.code} - ${audio.error.message || 'Unknown error'}`
          : 'Unknown audio error';
        
        console.error("Audio error:", errorMessage, audio.error);
        toast.error(`Error playing audio: ${errorMessage}`);
        setIsAISpeaking(false);
        setIsLoading(false);
        setAudioError(errorMessage);
      };
    } catch (error) {
      console.error("Exception creating audio element:", error);
      toast.error(`Error creating audio player: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsAISpeaking(false);
      setIsLoading(false);
      setAudioError(`Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
            <p>Status: {isAISpeaking ? "Playing audio" : isLoading ? "Loading audio..." : audioError ? "Error" : "Ready"}</p>
            {audioError && (
              <p className="text-red-500 mt-2">{audioError}</p>
            )}
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
