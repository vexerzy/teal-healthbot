
import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { HealthForm } from "@/components/health/HealthForm";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { MessageSquare, User, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppNavbar } from "@/components/layout/AppNavbar";

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
      } else {
        setShowHealthForm(true);
      }
    }
  }, [user, isLoading]);

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      setShowEmailForm(false);
      const savedHealthInfo = localStorage.getItem(`healthInfo-${user?.id}`);
      if (savedHealthInfo) {
        // Do not auto-navigate
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
    <div className="min-h-screen flex flex-col items-center bg-background relative w-full">
      <div className="stethoscope-pattern"></div>
      
      {user && <AppNavbar currentPage="home" />}
      
      <div className={`w-full ${user ? "md:pl-64" : ""} transition-all`}>
        {showWelcome && (
          <div className="w-full max-w-none px-4 py-12">
            <WelcomeScreen onGetStarted={() => {
              setShowWelcome(false);
              setShowEmailForm(true);
            }} />
          </div>
        )}
        
        {!showWelcome && showEmailForm && (
          <div className="w-full max-w-md mx-auto px-4 py-12">
            <AuthScreen
              onLogin={handleLogin}
              onSignUp={handleSignUp}
            />
          </div>
        )}
        
        {showHealthForm && (
          <div className="w-full max-w-md mx-auto px-4 py-12">
            <HealthForm
              healthInfo={healthInfo}
              onHealthInfoChange={setHealthInfo}
              onSubmit={handleHealthSubmit}
            />
          </div>
        )}
        
        {user && !showWelcome && !showEmailForm && !showHealthForm && (
          <div className="w-full max-w-5xl mx-auto px-4 pt-12 md:pt-20 pb-12">
            <h1 className="text-3xl font-bold text-primary mb-8 text-center">Welcome to Hearth</h1>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card className="p-6 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border-primary/20" onClick={() => navigate('/chat')}>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Chat with Assistant</h2>
                    <p className="text-muted-foreground">Get answers to your health questions and receive personalized advice</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border-primary/20" onClick={() => navigate('/profile')}>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Update Profile</h2>
                    <p className="text-muted-foreground">Update your health information and personal details</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border-primary/20" onClick={() => navigate('/history')}>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <History className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Chat History</h2>
                    <p className="text-muted-foreground">Review your previous conversations with the assistant</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border-primary/20" onClick={() => navigate('/settings')}>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Settings</h2>
                    <p className="text-muted-foreground">Customize your app experience and preferences</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
