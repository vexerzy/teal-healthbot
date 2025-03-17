
import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { HealthForm } from "@/components/health/HealthForm";
import { useUser } from "@/context/UserContext";
import { Menu, User, Palette, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, isLoading, login, signup } = useUser();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [healthInfo, setHealthInfo] = useState({
    age: "",
    weight: "",
    height: "",
    sleepHours: "",
    conditions: ""
  });
  const [theme, setTheme] = useState("teal");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      // Skip welcome and auth screens if already logged in
      setShowWelcome(false);
      setShowEmailForm(false);
      
      // Check if health info exists
      const savedHealthInfo = localStorage.getItem(`healthInfo-${user.id}`);
      if (savedHealthInfo) {
        setHealthInfo(JSON.parse(savedHealthInfo));
        navigate('/chat');
      } else {
        setShowHealthForm(true);
      }
    }
  }, [user, isLoading, navigate]);

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      setShowEmailForm(false);
      const savedHealthInfo = localStorage.getItem(`healthInfo-${user?.id}`);
      if (savedHealthInfo) {
        navigate('/chat');
      } else {
        setShowHealthForm(true);
      }
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    const success = await signup(name, email, password);
    if (success) {
      setIsNewUser(true);
      setShowEmailForm(false);
      setShowHealthForm(true);
    }
  };

  const handleHealthSubmit = () => {
    if (user) {
      // Save health info
      localStorage.setItem(`healthInfo-${user.id}`, JSON.stringify(healthInfo));
    }
    setShowHealthForm(false);
    navigate('/chat');
  };

  const toggleTheme = () => {
    const newTheme = theme === "teal" ? "purple" : "teal";
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex space-x-2">
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 bg-background relative w-full">
      <div className="stethoscope-pattern"></div>
      
      {!showWelcome && !showEmailForm && !showHealthForm && (
        <div className="absolute top-4 left-4 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={8}>
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
        <div className="w-full max-w-none px-4">
          <WelcomeScreen onGetStarted={() => {
            setShowWelcome(false);
            setShowEmailForm(true);
          }} />
        </div>
      )}
      
      {!showWelcome && showEmailForm && (
        <div className="w-full max-w-md px-4">
          <AuthScreen
            onLogin={handleLogin}
            onSignUp={handleSignUp}
          />
        </div>
      )}
      
      {showHealthForm && (
        <div className="w-full max-w-md px-4">
          <HealthForm
            healthInfo={healthInfo}
            onHealthInfoChange={setHealthInfo}
            onSubmit={handleHealthSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
