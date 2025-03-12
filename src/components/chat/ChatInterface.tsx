
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
        setCurrentInput(transcript);
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
      
      // If we have transcribed text, send it
      if (currentInput.trim()) {
        handleSend(currentInput);
      } else {
        toast.success("Listening stopped");
      }
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.success("Listening...");
      setCurrentInput("");
      setIsAISpeaking(false);
    }
  };

  const handleSend = async (textToSend = currentInput) => {
    if (!textToSend.trim() || isProcessing) return;
    
    if (isListening) {
      toggleListening();
    }

    const userMessage = textToSend;
    const timestamp = new Date().toISOString();
    
    setMessages(prev => [...prev, { sender: 'user', content: userMessage, timestamp }]);
    setCurrentInput("");
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
    <div className="w-full max-w-4xl h-[80vh] animate-fadeIn flex flex-col items-center">
      {/* Centered Audio Visualizer */}
      <div className="flex flex-col items-center justify-center mt-8 mb-8">
        <div className={`transform transition-all duration-300 ${isListening ? 'scale-110' : isAISpeaking ? 'scale-105' : 'scale-100'}`}>
          <AudioVisualizer 
            isAISpeaking={isAISpeaking || isListening}
            audioRef={audioRef}
          />
        </div>
        
        {isListening && (
          <p className="text-primary animate-pulse mt-4">Listening...</p>
        )}
        
        {isAISpeaking && (
          <p className="text-primary mt-4">Speaking...</p>
        )}
        
        {!isListening && !isAISpeaking && messages.length === 0 && isMicAvailable && (
          <p className="text-muted-foreground mt-4">Say something or type a message</p>
        )}
      </div>

      {/* Messages display - more minimal and cleaner */}
      <div className="w-full flex-grow flex flex-col overflow-y-auto px-4 mt-4 no-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 mb-2 rounded-lg max-w-[80%] ${
              msg.sender === 'user'
                ? 'bg-primary/10 ml-auto'
                : 'bg-secondary/10 mr-auto'
            }`}
          >
            <div className="flex flex-col">
              <span>{msg.content}</span>
              <span className="text-xs text-muted-foreground mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="bg-secondary/10 p-3 rounded-lg max-w-[80%] mr-auto mb-2">
            <div className="flex space-x-2">
              <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Update the mic button styling */}
      {!isListening && !isAISpeaking && (
        <Button
          onClick={toggleListening}
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 rounded-full h-16 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 shadow-lg"
          size="icon"
        >
          <Mic className="h-8 w-8 text-white" />
        </Button>
      )}

      {/* Animated Speech Input - back to corner position */}
      <AnimatedSpeechInput
        onSend={handleSend}
        isListening={isListening}
        toggleListening={toggleListening}
        isProcessing={isProcessing}
      />
    </div>
  );
};
