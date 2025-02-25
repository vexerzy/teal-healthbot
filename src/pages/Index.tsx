import { useState } from "react";
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { HealthForm } from "@/components/health/HealthForm";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Menu, User, Palette, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [healthInfo, setHealthInfo] = useState({
    age: "",
    weight: "",
    height: "",
    sleepHours: "",
    conditions: ""
  });
  const [theme, setTheme] = useState("teal");

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

  const toggleTheme = () => {
    const newTheme = theme === "teal" ? "purple" : "teal";
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
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
              <DropdownMenuItem className="flex items-center gap-2" onClick={toggleTheme}>
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

      {showWelcome && (
        <WelcomeScreen onGetStarted={() => {
          setShowWelcome(false);
          setShowEmailForm(true);
        }} />
      )}
      
      {!showWelcome && showEmailForm && (
        <AuthScreen
          onLogin={handleLogin}
          onSignUp={handleSignUp}
        />
      )}
      
      {showHealthForm && (
        <HealthForm
          healthInfo={healthInfo}
          onHealthInfoChange={setHealthInfo}
          onSubmit={handleHealthSubmit}
        />
      )}
      
      {showChat && (
        <ChatInterface onSend={() => {}} />
      )}
    </div>
  );
};

export default Index;
