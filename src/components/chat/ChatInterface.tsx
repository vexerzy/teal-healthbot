
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { initSpeechRecognition } from "@/utils/speechRecognition";
import { toast } from "sonner";
import { AudioVisualizer } from "../audio/AudioVisualizer";
import { AnimatedSpeechInput } from "./AnimatedSpeechInput";

interface ChatInterfaceProps {
  onSend: (message: string) => void;
  userId?: string | null;
}

export const ChatInterface = ({ onSend, userId }: ChatInterfaceProps) => {
  const [currentInput, setCurrentInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai', content: string, timestamp: string }[]>([]);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMicAvailable, setIsMicAvailable] = useState(true);
  const [transcribedText, setTranscribedText] = useState("");

  // Demo responses for testing
  const demoResponses = [
    "I understand you're experiencing pain in your left leg. Could you describe the pain more specifically? Is it sharp, dull, constant, or intermittent?",
    "Based on what you've shared, I recommend resting your leg and applying ice to reduce inflammation. If the pain persists for more than a few days, you should consult with a healthcare professional.",
    "It's important to monitor your symptoms. Have you noticed any swelling, redness, or difficulty bearing weight on your leg?",
    "I'm here to help, but remember I'm not a substitute for professional medical advice. If your pain is severe or worsening, please seek medical attention."
  ];

  useEffect(() => {
    // Load chat history from localStorage if userId exists
    if (userId) {
      const savedMessages = localStorage.getItem(`chatHistory-${userId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } else {
      // Load temp chat history if no userId
      const tempMessages = localStorage.getItem('tempChatHistory');
      if (tempMessages) {
        setMessages(JSON.parse(tempMessages));
      }
    }

    recognitionRef.current = initSpeechRecognition();
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map(result => (result as any)[0])
          .map(result => result.transcript)
          .join("");
        setTranscribedText(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error(event.error);
        setIsListening(false);
        toast.error("Error with speech recognition. Please try again.");
        if (event.error === 'not-allowed' || event.error === 'audio-capture' || event.error === 'no-speech') {
          setIsMicAvailable(false);
        }
      };
    } else {
      setIsMicAvailable(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [userId]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      if (userId) {
        localStorage.setItem(`chatHistory-${userId}`, JSON.stringify(messages));
      } else {
        localStorage.setItem('tempChatHistory', JSON.stringify(messages));
      }
    }
  }, [messages, userId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.success("Listening stopped");
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.success("Listening...");
      setTranscribedText("");
      setIsAISpeaking(false);
    }
  };

  const handleSend = async (textToSend = transcribedText) => {
    if (!textToSend.trim() || isProcessing) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage = textToSend;
    const timestamp = new Date().toISOString();
    
    setMessages(prev => [...prev, { sender: 'user', content: userMessage, timestamp }]);
    setTranscribedText("");
    setIsProcessing(true);

    try {
      // Instead of making an API call, use a random demo response
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get a random response from our demo responses
      const randomIndex = Math.floor(Math.random() * demoResponses.length);
      const aiResponse = demoResponses[randomIndex];
      
      setMessages(prev => [...prev, { sender: 'ai', content: aiResponse, timestamp: new Date().toISOString() }]);
      
      // Simulate text-to-speech with audio visualizer
      setIsAISpeaking(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setIsAISpeaking(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
      if (userId) {
        localStorage.removeItem(`chatHistory-${userId}`);
      } else {
        localStorage.removeItem('tempChatHistory');
      }
      toast.success("Chat history cleared");
    }
  };

  return (
    <div className="w-full h-[90vh] animate-fadeIn flex flex-col items-center relative">
      <div className="stethoscope-pattern"></div>
      
      {/* Chat Header */}
      <div className="w-full py-6 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm border-b border-primary/20 mb-8">
        <h2 className="text-2xl font-bold text-primary">Health Assistant</h2>
        <p className="text-muted-foreground">Ask me anything about your health concerns</p>
      </div>
      
      {/* Centered Audio Visualizer with improved styling */}
      <div className="flex flex-col items-center justify-center mb-8 scale-125">
        <div className={`transform transition-all duration-300 ${isListening ? 'scale-110' : isAISpeaking ? 'scale-105' : 'scale-100'}`}>
          <AudioVisualizer 
            isAISpeaking={isAISpeaking || isListening}
            audioRef={audioRef}
          />
        </div>
        
        {isListening && (
          <p className="text-primary animate-pulse mt-4 font-medium">Listening...</p>
        )}
        
        {isListening && (
          <div className="mt-4 p-6 bg-primary/5 rounded-lg w-full max-w-3xl shadow-md backdrop-blur-sm border border-primary/20">
            <p className="text-xl">{transcribedText || "Speak now..."}</p>
            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={toggleListening}
                className="flex items-center gap-2"
              >
                <MicOff className="h-5 w-5" />
                Stop Listening
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                onClick={() => handleSend()}
                disabled={!transcribedText.trim()}
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit
              </Button>
            </div>
          </div>
        )}
        
        {isAISpeaking && (
          <p className="text-primary mt-4 font-medium">Speaking...</p>
        )}
      </div>

      {/* Messages display with improved styling */}
      <div className="w-full flex-grow flex flex-col overflow-y-auto px-8 py-6 space-y-6 no-scrollbar bg-card/10 backdrop-blur-sm rounded-lg border border-primary/10 shadow-inner">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl max-w-[80%] shadow-lg ${
              msg.sender === 'user'
                ? 'bg-primary/10 border border-primary/20 ml-auto'
                : 'bg-background/80 border border-primary/10 mr-auto'
            }`}
          >
            <div className="flex flex-col">
              <span className="leading-relaxed text-lg">{msg.content}</span>
              <span className="text-xs text-muted-foreground mt-2">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="bg-background/80 border border-primary/10 p-4 rounded-2xl max-w-[80%] mr-auto shadow-lg">
            <div className="flex space-x-2">
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mic button when not currently listening */}
      {!isListening && !isAISpeaking && (
        <Button
          onClick={toggleListening}
          className="mt-8 mb-6 rounded-full h-20 w-20 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          size="icon"
        >
          <Mic className="h-10 w-10" />
        </Button>
      )}

      {/* Animated Speech Input */}
      <AnimatedSpeechInput
        onSend={handleSend}
        isListening={isListening}
        toggleListening={toggleListening}
        isProcessing={isProcessing}
      />
    </div>
  );
};
