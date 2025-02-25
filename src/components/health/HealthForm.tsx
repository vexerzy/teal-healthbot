
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Heart, Weight, Ruler, Bed } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-5 h-5 text-primary" />
                  Weight (kg)
                </Label>
                <span className="text-sm text-muted-foreground">{healthInfo.weight || "0"}kg</span>
              </div>
              <Slider
                id="weight"
                min={30}
                max={200}
                step={0.5}
                value={[Number(healthInfo.weight) || 70]}
                onValueChange={(value) => onHealthInfoChange({ ...healthInfo, weight: value[0].toString() })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Height (cm)
                </Label>
                <span className="text-sm text-muted-foreground">{healthInfo.height || "0"}cm</span>
              </div>
              <Slider
                id="height"
                min={100}
                max={220}
                step={1}
                value={[Number(healthInfo.height) || 170]}
                onValueChange={(value) => onHealthInfoChange({ ...healthInfo, height: value[0].toString() })}
              />
            </div>
          </div>

          <div className="space-y-6 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <div className="space-y-4">
              <Label htmlFor="age" className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Age
              </Label>
              <Select 
                value={healthInfo.age} 
                onValueChange={(value) => onHealthInfoChange({ ...healthInfo, age: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sleep" className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-primary" />
                  Sleep (hours)
                </Label>
                <span className="text-sm text-muted-foreground">{healthInfo.sleepHours || "8"}h</span>
              </div>
              <Slider
                id="sleep"
                min={4}
                max={12}
                step={0.5}
                value={[Number(healthInfo.sleepHours) || 8]}
                onValueChange={(value) => onHealthInfoChange({ ...healthInfo, sleepHours: value[0].toString() })}
              />
            </div>
          </div>
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          <Label htmlFor="conditions">Medical Conditions</Label>
          <Input
            id="conditions"
            placeholder="List any existing medical conditions..."
            value={healthInfo.conditions}
            onChange={(e) => onHealthInfoChange({ ...healthInfo, conditions: e.target.value })}
            className="glass-panel mt-2"
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
