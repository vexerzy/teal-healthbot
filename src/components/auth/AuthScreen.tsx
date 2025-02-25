
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Github, Mail } from "lucide-react";
import { useState } from "react";

interface AuthScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export const AuthScreen = ({ onLogin, onSignUp }: AuthScreenProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full max-w-md animate-slideIn">
      <Card className="p-6 glass-panel">
        <div className="space-y-4">
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
            <Button 
              className="w-full" 
              onClick={isLoginMode ? onLogin : onSignUp}
            >
              {isLoginMode ? "Sign In" : "Create Account"}
            </Button>

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
              onClick={isLoginMode ? onLogin : onSignUp}
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
              onClick={isLoginMode ? onLogin : onSignUp}
            >
              <Github className="w-5 h-5 absolute left-4" />
              Continue with GitHub
            </Button>

            <Button
              variant="outline"
              className="w-full relative hover:bg-secondary"
              onClick={() => {}}
            >
              <Mail className="w-5 h-5 absolute left-4" />
              Continue with Email
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
