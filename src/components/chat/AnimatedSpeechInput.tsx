
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Send, X, MessageCircle, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedSpeechInputProps {
  onSend: (message: string) => void;
  isListening: boolean;
  toggleListening: () => void;
  isProcessing: boolean;
}

export const AnimatedSpeechInput = ({
  onSend,
  isListening,
  toggleListening,
  isProcessing,
}: AnimatedSpeechInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Focus the input when expanded
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText);
      setInputText("");
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ width: "60px", height: "60px", borderRadius: "50%" }}
            animate={{ 
              width: ["60px", "calc(min(600px, 100vw - 2rem))"],
              height: "60px", 
              borderRadius: "30px"
            }}
            exit={{ width: "60px", height: "60px", borderRadius: "50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center gap-2 shadow-lg overflow-hidden absolute bottom-0 right-0 bg-primary text-primary-foreground"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 ml-2 bg-transparent text-primary-foreground hover:bg-white/10"
              onClick={handleToggleExpand}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              className="flex-grow border-none bg-transparent focus-visible:ring-0 text-primary-foreground placeholder:text-primary-foreground/70"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-12 w-12 ${isListening ? "bg-white/20" : ""} text-primary-foreground hover:bg-white/20`}
              onClick={toggleListening}
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="h-6 w-6 animate-pulse text-red-400" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 mr-2 text-primary-foreground hover:bg-white/20"
              onClick={handleSend}
              disabled={!inputText.trim() || isProcessing}
            >
              <Send className="h-6 w-6" />
            </Button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-16 w-16 rounded-full flex items-center justify-center shadow-lg bg-primary text-primary-foreground"
            onClick={handleToggleExpand}
          >
            <MessageCircle className="h-8 w-8 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
