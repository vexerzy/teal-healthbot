
import { Brain, Bot, Shield, LogIn, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onAboutClick: () => void;
}

export const WelcomeScreen = ({ onGetStarted, onAboutClick }: WelcomeScreenProps) => {
  return (
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

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onGetStarted}
        >
          Get Started
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center gap-2"
          onClick={onAboutClick}
        >
          <Info className="w-4 h-4" />
          About Hearth
        </Button>
      </div>
    </div>
  );
};
