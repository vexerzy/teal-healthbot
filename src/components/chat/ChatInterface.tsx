
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { initSpeechRecognition } from "@/utils/speechRecognition";
import { toast } from "sonner";
import { AudioVisualizer } from "../audio/AudioVisualizer";

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
  const [isProcessing, setIsProcessing] = useState(false);

  // Demo responses for testing
  const demoResponses = [
    "I understand you're experiencing pain in your left leg. Could you describe the pain more specifically? Is it sharp, dull, constant, or intermittent?",
    "Based on what you've shared, I recommend resting your leg and applying ice to reduce inflammation. If the pain persists for more than a few days, you should consult with a healthcare professional.",
    "It's important to monitor your symptoms. Have you noticed any swelling, redness, or difficulty bearing weight on your leg?",
    "I'm here to help, but remember I'm not a substitute for professional medical advice. If your pain is severe or worsening, please seek medical attention."
  ];

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
    if (!currentInput.trim() || isProcessing) return;
    
    if (isListening) {
      toggleListening();
    }

    const userMessage = currentInput;
    setMessages(prev => [...prev, { sender: 'user', content: userMessage }]);
    setCurrentInput("");
    setIsProcessing(true);

    try {
      // Instead of making an API call, use a random demo response
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get a random response from our demo responses
      const randomIndex = Math.floor(Math.random() * demoResponses.length);
      const aiResponse = demoResponses[randomIndex];
      
      setMessages(prev => [...prev, { sender: 'ai', content: aiResponse }]);
      
      // Optional: Simulate text-to-speech by showing the audio visualizer
      // Comment this section out if you don't want to test audio features yet
      /*
      setIsAISpeaking(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setIsAISpeaking(false);
      */
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl h-[80vh] animate-fadeIn">
      <Card className="p-8 glass-panel h-full flex flex-col relative">
        <div className="flex-grow flex flex-col items-center mb-8 overflow-y-auto">
          <AudioVisualizer 
            isAISpeaking={isAISpeaking}
            audioRef={audioRef}
          />
          <div className="w-full space-y-4 mt-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Ask me anything about your health concerns.
              </div>
            )}
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
            {isProcessing && (
              <div className="bg-secondary/20 p-4 rounded-lg max-w-[80%] mr-auto">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
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
            disabled={isProcessing}
          />
          <Button
            variant="outline"
            size="icon"
            className={`${isListening ? 'bg-primary text-primary-foreground' : ''} transition-colors`}
            onClick={toggleListening}
            disabled={isProcessing}
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
            disabled={!currentInput.trim() || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Send'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
