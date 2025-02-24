
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
  const recognitionRef = useRef<any>(null);

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

  const handleSend = () => {
    if (!currentInput.trim()) return;
    
    if (isListening) {
      toggleListening();
    }
    onSend(currentInput);
    setCurrentInput("");
  };

  return (
    <div className="w-full max-w-4xl h-[80vh] animate-fadeIn">
      <Card className="p-8 glass-panel h-full flex flex-col relative">
        <div className="flex-grow flex items-center justify-center mb-8">
          <Flame 
            className={`w-32 h-32 text-primary transition-all duration-300 ${
              isListening || isAISpeaking ? 'scale-110 animate-pulse' : ''
            }`} 
          />
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type or speak your health question..."
            className="glass-panel"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
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
