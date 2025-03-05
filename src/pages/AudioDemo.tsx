
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AudioVisualizer } from "@/components/audio/AudioVisualizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AudioDemo = () => {
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiInput, setShowApiInput] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playDemoAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio("/demo-tts.mp3");
    audioRef.current = audio;
    setIsAISpeaking(true);
    
    audio.onended = () => {
      setIsAISpeaking(false);
    };

    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast.error("Error playing audio");
      setIsAISpeaking(false);
    });
  };

  const handleGenerateSpeech = async () => {
    if (!apiKey) {
      toast.error("Please enter your OpenAI API key");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);

    try {
      // Call OpenAI API directly from browser (not recommended for production)
      const responseData = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are an experienced medical doctor providing healthcare advice. Keep responses clear, professional, and focused on evidence-based medicine. Always encourage users to seek in-person medical care when appropriate.' 
            },
            { role: 'user', content: message }
          ],
        }),
      });

      if (!responseData.ok) {
        throw new Error(`Failed to get AI response: ${await responseData.text()}`);
      }

      const textResponse = await responseData.json();
      const aiMessage = textResponse.choices[0].message.content;

      // Call OpenAI TTS API
      const speechResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'alloy',
          input: aiMessage,
        }),
      });

      if (!speechResponse.ok) {
        throw new Error(`Failed to generate speech: ${await speechResponse.text()}`);
      }

      // Create audio from the response
      const audioBlob = await speechResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      setIsAISpeaking(true);
      setShowApiInput(false);
      
      audio.onended = () => {
        setIsAISpeaking(false);
      };

      await audio.play();
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error generating speech. Check your API key and try again.');
    } finally {
      setIsLoading(false);
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
        <h1 className="text-3xl font-bold mb-6 text-center">Audio Visualizer Demo</h1>
        
        <div className="flex flex-col items-center justify-center mb-8 h-80">
          <AudioVisualizer 
            isAISpeaking={isAISpeaking}
            audioRef={audioRef}
          />
        </div>

        {showApiInput ? (
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Enter a message for the AI to respond to"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full"
            />
            <div className="flex gap-4">
              <Button 
                onClick={handleGenerateSpeech} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Generating..." : "Generate AI Speech"}
              </Button>
              <Button 
                variant="secondary" 
                onClick={playDemoAudio}
                className="w-full"
              >
                Play Demo Audio
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              variant="secondary" 
              onClick={() => setShowApiInput(true)}
              className="w-full"
            >
              Generate New Response
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AudioDemo;
