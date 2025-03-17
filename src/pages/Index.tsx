
import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { HealthForm } from "@/components/health/HealthForm";
import { useUser } from "@/context/UserContext";
import { MessageSquare, User, Palette, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, isLoading, login, signup, logout } = useUser();
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
        // Let's not auto-navigate to chat
        // navigate('/chat');
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
        // Do not auto-navigate
        // navigate('/chat');
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
    // Let the user decide where to go next
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
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 bg-background relative w-full">
      <div className="stethoscope-pattern"></div>
      
      {user && (
        <div className="absolute top-0 left-0 right-0 bg-background shadow-sm border-b border-primary/20 py-3 px-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary">Health Assistant</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/chat')}
              className="flex items-center gap-1 border-primary/30 text-primary hidden sm:flex"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 border-primary/30">
                  <User className="h-4 w-4 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer sm:hidden"
                  onClick={() => navigate('/chat')}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowHealthForm(true)}
                >
                  <User className="h-4 w-4" />
                  Update Health Info
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={toggleTheme}
                >
                  <Palette className="h-4 w-4" />
                  Toggle Theme
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
      
      {user && !showWelcome && !showEmailForm && !showHealthForm && (
        <div className="w-full max-w-2xl px-4 mt-20">
          <div className="flex flex-col items-center justify-center gap-6 py-12">
            <h1 className="text-3xl font-bold text-primary">Welcome back!</h1>
            <p className="text-muted-foreground text-center max-w-md">
              What would you like to do today?
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/chat')}
                className="p-6 h-auto flex flex-col items-center justify-center gap-2 border-primary/30 hover:bg-primary/5"
              >
                <MessageSquare className="h-10 w-10 mb-2 text-primary" />
                <span className="text-lg font-medium">Chat with Assistant</span>
                <span className="text-sm text-muted-foreground">Get help with health questions</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowHealthForm(true)}
                className="p-6 h-auto flex flex-col items-center justify-center gap-2 border-primary/30 hover:bg-primary/5"
              >
                <User className="h-10 w-10 mb-2 text-primary" />
                <span className="text-lg font-medium">Update Health Profile</span>
                <span className="text-sm text-muted-foreground">Manage your health information</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
