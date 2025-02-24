
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, Weight, Ruler, Bed } from "lucide-react";

interface HealthFormProps {
  healthInfo: {
    age: string;
    weight: string;
    height: string;
    sleepHours: string;
    conditions: string;
  };
  onHealthInfoChange: (info: any) => void;
  onSubmit: () => void;
}

export const HealthForm = ({ healthInfo, onHealthInfoChange, onSubmit }: HealthFormProps) => {
  return (
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
                onChange={(e) => onHealthInfoChange({ ...healthInfo, weight: e.target.value })}
                className="glass-panel"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Ruler className="w-5 h-5 text-primary" />
              <Input
                type="number"
                placeholder="Height (cm)"
                value={healthInfo.height}
                onChange={(e) => onHealthInfoChange({ ...healthInfo, height: e.target.value })}
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
                onChange={(e) => onHealthInfoChange({ ...healthInfo, age: e.target.value })}
                className="glass-panel"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Bed className="w-5 h-5 text-primary" />
              <Input
                type="number"
                placeholder="Average sleep hours"
                value={healthInfo.sleepHours}
                onChange={(e) => onHealthInfoChange({ ...healthInfo, sleepHours: e.target.value })}
                className="glass-panel"
              />
            </div>
          </div>
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          <Input
            placeholder="Any existing medical conditions?"
            value={healthInfo.conditions}
            onChange={(e) => onHealthInfoChange({ ...healthInfo, conditions: e.target.value })}
            className="glass-panel"
          />
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
            onClick={onSubmit}
          >
            Continue to Chat
          </Button>
        </div>
      </Card>
    </div>
  );
};
