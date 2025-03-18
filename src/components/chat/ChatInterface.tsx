import { Button } from "@/components/ui/button";
import { Mic, MicOff, MessageSquare, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { initSpeechRecognition } from "@/utils/speechRecognition";
import { toast } from "sonner";
import { PulsingFlame } from "./PulsingFlame";

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
  const [showTextInput, setShowTextInput] = useState(false);

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
      setShowTextInput(false);
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
    setShowTextInput(false);

    try {
      // Instead of making an API call, use a random demo response
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get a random response from our demo responses
      const randomIndex = Math.floor(Math.random() * demoResponses.length);
      const aiResponse = demoResponses[randomIndex];
      
      setMessages(prev => [...prev, { sender: 'ai', content: aiResponse, timestamp: new Date().toISOString() }]);
      
      // Simulate text-to-speech with flame animation
      setIsAISpeaking(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
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

  const toggleTextInput = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setShowTextInput(!showTextInput);
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] animate-fadeIn flex flex-col items-center relative overflow-hidden">
      <div className="stethoscope-pattern opacity-10"></div>
      
      {/* Messages display with improved styling */}
      <div className="w-full max-w-7xl flex-grow flex flex-col overflow-y-auto px-4 md:px-8 pt-4 pb-20 space-y-4 no-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl max-w-[80%] shadow-md ${
              msg.sender === 'user'
                ? 'bg-primary/10 border border-primary/20 ml-auto'
                : 'bg-background/80 border border-primary/10 mr-auto'
            }`}
          >
            <div className="flex flex-col">
              <span className="leading-relaxed">{msg.content}</span>
              <span className="text-xs text-muted-foreground mt-2">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="bg-background/80 border border-primary/10 p-3 rounded-xl max-w-[80%] mr-auto shadow-md">
            <div className="flex space-x-2">
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Listening mode UI */}
      {isListening && (
        <div className="absolute bottom-20 left-0 right-0 mx-auto p-4 bg-primary/5 rounded-lg w-full max-w-3xl shadow-md backdrop-blur-sm border border-primary/20">
          <p className="text-lg">{transcribedText || "Speak now..."}</p>
          <div className="mt-4 flex justify-end space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleListening}
              className="flex items-center gap-2"
            >
              <MicOff className="h-4 w-4" />
              Stop Listening
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => handleSend()}
              disabled={!transcribedText.trim()}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <MessageSquare className="h-4 w-4" />
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* No more flame animation during AI speech */}
      {isListening && (
        <div className="absolute bottom-72 left-0 right-0 flex flex-col items-center justify-center">
          <PulsingFlame isActive={isListening} />
          <p className="text-primary animate-pulse mt-2 font-medium">Listening...</p>
        </div>
      )}

      {/* Text input mode UI */}
      {showTextInput && !isListening && (
        <div className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-3xl px-4">
          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend(currentInput);
                  setCurrentInput('');
                }
              }}
              placeholder="Type your message..." 
              className="flex-grow p-3 rounded-lg border border-primary/20 bg-background/80 backdrop-blur-sm focus:border-primary"
            />
            <Button 
              onClick={() => {
                handleSend(currentInput);
                setCurrentInput('');
              }}
              disabled={!currentInput.trim()}
              size="icon"
              className="rounded-full bg-primary text-primary-foreground h-10 w-10"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button
              onClick={toggleTextInput}
              size="icon"
              className="rounded-full h-10 w-10 bg-primary/20 hover:bg-primary/30 text-primary"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Interaction buttons */}
      {!isListening && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4">
          {!showTextInput && (
            <Button
              onClick={toggleTextInput}
              className="rounded-full h-12 w-12 bg-primary/80 hover:bg-primary/90 text-primary-foreground shadow-md"
              size="icon"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          )}
          
          {!showTextInput && (
            <Button
              onClick={toggleListening}
              className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              size="icon"
            >
              <Mic className="h-6 w-6" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
