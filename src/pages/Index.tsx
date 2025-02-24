import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Brain, Flame, Github, Heart, LogIn, Mail, Shield, Weight, Ruler, Bed, Mic, MicOff, Menu, Settings, User, Palette } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [healthInfo, setHealthInfo] = useState({
    age: "",
    weight: "",
    height: "",
    sleepHours: "",
    conditions: ""
  });
  const [isListening, setIsListening] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [theme, setTheme] = useState("teal");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join("");
          setCurrentInput(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error(event.error);
          setIsListening(false);
          toast.error("Error with speech recognition. Please try again.");
        };
      }
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

  const handleLogin = () => {
    setShowEmailForm(false);
    setShowChat(true);
  };

  const handleSignUp = () => {
    setIsNewUser(true);
    setShowEmailForm(false);
    setShowHealthForm(true);
  };

  const handleHealthSubmit = () => {
    setShowHealthForm(false);
    setShowChat(true);
  };

  const speakText = async (text: string) => {
    setIsAISpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsAISpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const simulateAIResponse = async () => {
    const response = "I understand. Based on your input, I'd recommend focusing on maintaining a regular sleep schedule and staying hydrated. Would you like more specific advice about any particular health concern?";
    setIsAISpeaking(true);
    await speakText(response);
  };

  const handleSend = () => {
    if (!currentInput.trim()) return;
    
    console.log("Sending message:", currentInput);
    setCurrentInput("");
    if (isListening) {
      toggleListening();
    }
    simulateAIResponse();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative">
      {showChat && (
        <div className="absolute top-4 left-4 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => setShowHealthForm(true)}>
                <User className="h-4 w-4" />
                Update Health Info
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => setTheme(theme === "teal" ? "purple" : "teal")}>
                <Palette className="h-4 w-4" />
                Toggle Theme
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {showWelcome ? (
        <div className="max-w-4xl w-full space-y-8 animate-fadeIn">
          <div className="text-center space-y-4">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Hearth, your AI Health Assistant
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of healthcare with our AI-powered medical assistant.
              Get instant insights and personalized care recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 glass-panel">
              <Bot className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Advanced AI technology providing accurate medical insights and recommendations.
              </p>
            </Card>

            <Card className="p-6 glass-panel">
              <Shield className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your health data is encrypted and protected with enterprise-grade security.
              </p>
            </Card>

            <Card className="p-6 glass-panel">
              <LogIn className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy Access</h3>
              <p className="text-muted-foreground">
                Multiple sign-in options for a seamless healthcare experience.
              </p>
            </Card>
          </div>

          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowWelcome(false)}
            >
              Get Started
            </Button>
          </div>
        </div>
      ) : showHealthForm ? (
        <div className="w-full max-w-2xl animate-slideIn">
          <Card className="p-8 glass-panel space-y-8">
            <div className="text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-2">Let's Get to Know You Better</h2>
              <p className="text-muted-foreground">Help us personalize your healthcare experience</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center space-x-3">
                  <Weight className="w-5 h-5 text-primary" />
                  <Input
                    type="number"
                    placeholder="Weight (kg)"
                    value={healthInfo.weight}
                    onChange={(e) => setHealthInfo({ ...healthInfo, weight: e.target.value })}
                    className="glass-panel"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Ruler className="w-5 h-5 text-primary" />
                  <Input
                    type="number"
                    placeholder="Height (cm)"
                    value={healthInfo.height}
                    onChange={(e) => setHealthInfo({ ...healthInfo, height: e.target.value })}
                    className="glass-panel"
                  />
                </div>
              </div>

              <div className="space-y-4 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-primary" />
                  <Input
                    type="number"
                    placeholder="Age"
                    value={healthInfo.age}
                    onChange={(e) => setHealthInfo({ ...healthInfo, age: e.target.value })}
                    className="glass-panel"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Bed className="w-5 h-5 text-primary" />
                  <Input
                    type="number"
                    placeholder="Average sleep hours"
                    value={healthInfo.sleepHours}
                    onChange={(e) => setHealthInfo({ ...healthInfo, sleepHours: e.target.value })}
                    className="glass-panel"
                  />
                </div>
              </div>
            </div>

            <div className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>
              <Input
                placeholder="Any existing medical conditions?"
                value={healthInfo.conditions}
                onChange={(e) => setHealthInfo({ ...healthInfo, conditions: e.target.value })}
                className="glass-panel"
              />
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 animate-fadeIn"
                style={{ animationDelay: "0.4s" }}
                onClick={handleHealthSubmit}
              >
                Continue to Chat
              </Button>
            </div>
          </Card>
        </div>
      ) : showChat ? (
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
      ) : (
        <div className="w-full max-w-md animate-slideIn">
          <Card className="p-6 glass-panel">
            {showEmailForm ? (
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="w-full" onClick={handleLogin}>
                  Sign in with Email
                </Button>
                <Button className="w-full" onClick={handleSignUp}>
                  Sign up with Email
                </Button>
                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-sm text-muted-foreground"
                    onClick={() => setShowEmailForm(false)}
                  >
                    Back to all options
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
                <Button
                  variant="outline"
                  className="w-full relative hover:bg-secondary"
                  onClick={handleLogin}
                >
                  <svg
                    className="w-5 h-5 absolute left-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full relative hover:bg-secondary"
                  onClick={handleLogin}
                >
                  <Github className="w-5 h-5 absolute left-4" />
                  Continue with GitHub
                </Button>

                <Button
                  variant="outline"
                  className="w-full relative hover:bg-secondary"
                  onClick={() => setShowEmailForm(true)}
                >
                  <Mail className="w-5 h-5 absolute left-4" />
                  Continue with Email
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
