
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Heart, Weight, Ruler, Bed } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";

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
  const [units, setUnits] = useState<"imperial" | "metric">("imperial");
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(8);
  const [weightLbs, setWeightLbs] = useState<number>(160);

  // Convert between metric and imperial on first load
  useEffect(() => {
    if (healthInfo.height) {
      const heightCm = parseFloat(healthInfo.height);
      if (!isNaN(heightCm)) {
        const totalInches = heightCm / 2.54;
        const ft = Math.floor(totalInches / 12);
        const inch = Math.round(totalInches % 12);
        setFeet(ft || 5);
        setInches(inch || 8);
      }
    }

    if (healthInfo.weight) {
      const weightKg = parseFloat(healthInfo.weight);
      if (!isNaN(weightKg)) {
        setWeightLbs(Math.round(weightKg * 2.20462) || 160);
      }
    }

    // Set sleep hours default to 7 if not set
    if (!healthInfo.sleepHours) {
      onHealthInfoChange({ ...healthInfo, sleepHours: "7" });
    }
  }, []);

  // Update height when feet/inches change
  useEffect(() => {
    if (units === "imperial") {
      const heightCm = ((feet * 12) + inches) * 2.54;
      onHealthInfoChange({ ...healthInfo, height: heightCm.toFixed(1) });
    }
  }, [feet, inches, units]);

  // Update weight when pounds change
  useEffect(() => {
    if (units === "imperial") {
      const weightKg = weightLbs / 2.20462;
      onHealthInfoChange({ ...healthInfo, weight: weightKg.toFixed(1) });
    }
  }, [weightLbs, units]);

  // Handle unit change
  const handleUnitChange = (value: "imperial" | "metric") => {
    setUnits(value);
  };

  return (
    <div className="w-full max-w-2xl animate-slideIn">
      <Card className="p-8 glass-panel space-y-8">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold mb-2">Let's Get to Know You Better</h2>
          <p className="text-muted-foreground">Help us personalize your healthcare experience</p>
        </div>

        <div className="flex justify-center mb-4">
          <RadioGroup 
            value={units} 
            onValueChange={(value) => handleUnitChange(value as "imperial" | "metric")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="imperial" id="imperial" />
              <Label htmlFor="imperial">US Units</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="metric" id="metric" />
              <Label htmlFor="metric">Metric</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            {units === "imperial" ? (
              <div className="space-y-4">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-5 h-5 text-primary" />
                  Weight (lbs)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="weight"
                    type="number"
                    min="50"
                    max="500"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-20"
                  />
                  <span>pounds</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="weight" className="flex items-center gap-2">
                    <Weight className="w-5 h-5 text-primary" />
                    Weight (kg)
                  </Label>
                  <span className="text-sm text-muted-foreground">{healthInfo.weight || "70"}kg</span>
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
            )}

            {units === "imperial" ? (
              <div className="space-y-4">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Height
                </Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      id="feet"
                      type="number"
                      min="3"
                      max="8"
                      value={feet}
                      onChange={(e) => setFeet(Number(e.target.value))}
                      className="w-16"
                    />
                    <span>ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="inches"
                      type="number"
                      min="0"
                      max="11"
                      value={inches}
                      onChange={(e) => setInches(Number(e.target.value))}
                      className="w-16"
                    />
                    <span>in</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="height" className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-primary" />
                    Height (cm)
                  </Label>
                  <span className="text-sm text-muted-foreground">{healthInfo.height || "170"}cm</span>
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
            )}
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
                <span className="text-sm text-muted-foreground">{healthInfo.sleepHours || "7"}h</span>
              </div>
              <Slider
                id="sleep"
                min={4}
                max={12}
                step={0.5}
                value={[Number(healthInfo.sleepHours) || 7]}
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
