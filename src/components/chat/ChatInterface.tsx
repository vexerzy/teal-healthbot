
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Flame, Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { initSpeechRecognition } from "@/utils/speechRecognition";
import { toast } from "sonner";

interface ChatInterfaceProps {
  onSend: (message: string) => void;
}

export const ChatInterface = ({ onSend }: ChatInterfaceProps) => {
  const [currentInput, setCurrentInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai', content: string }[]>([]);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    recognitionRef.current = initSpeechRecognition();
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map(result => (result as any)[0])
          .map(result => result.transcript)
          .join("");
        setCurrentInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error(event.error);
        setIsListening(false);
        toast.error("Error with speech recognition. Please try again.");
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.success("Listening...");
    }
  };

  const handleSend = async () => {
    if (!currentInput.trim()) return;
    
    if (isListening) {
      toggleListening();
    }

    const userMessage = currentInput;
    setMessages(prev => [...prev, { sender: 'user', content: userMessage }]);
    setCurrentInput("");

    try {
      const response = await fetch('/functions/chat-with-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ai', content: data.message }]);

      // Play audio response
      if (data.audio) {
        setIsAISpeaking(true);
        const audio = new Audio(data.audio);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsAISpeaking(false);
        };

        await audio.play();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get AI response. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-4xl h-[80vh] animate-fadeIn">
      <Card className="p-8 glass-panel h-full flex flex-col relative">
        <div className="flex-grow flex flex-col items-center mb-8 overflow-y-auto">
          <Flame 
            className={`w-32 h-32 text-primary transition-all duration-300 mb-8 ${
              isListening || isAISpeaking ? 'scale-110 animate-pulse' : ''
            }`} 
          />
          <div className="w-full space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-primary/20 ml-auto'
                    : 'bg-secondary/20 mr-auto'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type or speak your health question..."
            className="glass-panel"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <Button
            variant="outline"
            size="icon"
            className={`${isListening ? 'bg-primary text-primary-foreground' : ''} transition-colors`}
            onClick={toggleListening}
          >
            {isListening ? (
              <MicOff className="h-4 w-4 animate-pulse" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSend}
            disabled={!currentInput.trim()}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};
