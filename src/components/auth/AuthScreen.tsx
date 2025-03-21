
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Github, Mail, User as UserIcon, Shield } from "lucide-react";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface AuthScreenProps {
  onLogin: (email: string, password: string, otpCode?: string) => void;
  onSignUp: (name: string, email: string, password: string) => void;
}

export const AuthScreen = ({ onLogin, onSignUp }: AuthScreenProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      if (showOtp) {
        onLogin(email, password, otpCode);
      } else {
        // For demo purposes, we'll just toggle the OTP screen
        // In a real app, this would verify the credentials first
        setShowOtp(true);
      }
    } else {
      onSignUp(name, email, password);
    }
  };

  const handleBackToLogin = () => {
    setShowOtp(false);
  };

  return (
    <div className="w-full max-w-md animate-slideIn">
      <Card className="p-6 glass-panel">
        <div className="space-y-4">
          {!showOtp && (
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                variant={isLoginMode ? "default" : "outline"}
                onClick={() => setIsLoginMode(true)}
                className="w-32"
              >
                Login
              </Button>
              <Button
                variant={!isLoginMode ? "default" : "outline"}
                onClick={() => setIsLoginMode(false)}
                className="w-32"
              >
                Sign Up
              </Button>
            </div>
          )}

          {showOtp ? (
            <div className="space-y-6">
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto text-primary mb-2" />
                <h2 className="text-xl font-bold mb-1">Two-Factor Authentication</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(value) => setOtpCode(value)}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, index) => (
                          <InputOTPSlot key={index} {...slot} index={index} />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Button type="submit" className="w-full">
                    Verify
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full text-sm" 
                    onClick={handleBackToLogin}
                  >
                    Back to login
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLoginMode}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full" 
              >
                {isLoginMode ? "Sign In" : "Create Account"}
              </Button>
            </form>
          )}

          {!showOtp && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted-foreground/20"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full relative hover:bg-secondary"
                onClick={() => {
                  isLoginMode 
                    ? onLogin("demo@example.com", "password") 
                    : onSignUp("Demo User", "demo@example.com", "password");
                }}
              >
                <UserIcon className="w-5 h-5 absolute left-4" />
                Continue as Demo User
              </Button>

              <Button
                variant="outline"
                className="w-full relative hover:bg-secondary"
                disabled
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
                Google Sign In
              </Button>

              <Button
                variant="outline"
                className="w-full relative hover:bg-secondary"
                disabled
              >
                <Github className="w-5 h-5 absolute left-4" />
                GitHub Sign In
              </Button>

              <Button
                variant="outline"
                className="w-full relative hover:bg-secondary"
                disabled
              >
                <Mail className="w-5 h-5 absolute left-4" />
                Magic Link
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
