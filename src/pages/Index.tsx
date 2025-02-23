
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Brain, Github, LogIn, Mail, Shield } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {showWelcome ? (
        <div className="max-w-4xl w-full space-y-8 animate-fadeIn">
          <div className="text-center space-y-4">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Your AI Health Assistant
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
      ) : (
        <div className="w-full max-w-md animate-slideIn">
          <Card className="p-6 glass-panel">
            <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
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
                <Button className="w-full" onClick={() => console.log("Email login")}>
                  Sign in with Email
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
                <Button
                  variant="outline"
                  className="w-full relative hover:bg-secondary"
                  onClick={() => console.log("Google login")}
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
                  onClick={() => console.log("GitHub login")}
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

                <div className="text-center text-sm text-muted-foreground">
                  <p>Don't have an account?</p>
                  <Button
                    variant="link"
                    className="text-primary"
                    onClick={() => console.log("Sign up")}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
