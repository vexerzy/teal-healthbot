
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, UserRound, Mail, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { toast } from "sonner";

const UserProfile = () => {
  const { user, isLoading, logout } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [healthInfo, setHealthInfo] = useState({
    age: "",
    weight: "",
    height: "",
    sleepHours: "",
    conditions: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [units, setUnits] = useState<"imperial" | "metric">("imperial");
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(8);
  const [weightLbs, setWeightLbs] = useState<number>(160);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
    
    if (user) {
      setName(user.name);
      setEmail(user.email);
      
      // Load health info
      const savedHealthInfo = localStorage.getItem(`healthInfo-${user.id}`);
      if (savedHealthInfo) {
        const parsedInfo = JSON.parse(savedHealthInfo);
        setHealthInfo(parsedInfo);
        
        // Convert metric to imperial
        if (parsedInfo.height) {
          const heightCm = parseFloat(parsedInfo.height);
          const totalInches = heightCm / 2.54;
          setFeet(Math.floor(totalInches / 12) || 5);
          setInches(Math.round(totalInches % 12) || 8);
        }
        
        if (parsedInfo.weight) {
          const weightKg = parseFloat(parsedInfo.weight);
          setWeightLbs(Math.round(weightKg * 2.20462) || 160);
        }
      }
    }
  }, [user, isLoading, navigate]);

  // Update height when feet/inches change
  useEffect(() => {
    if (units === "imperial" && isEditing) {
      const heightCm = ((feet * 12) + inches) * 2.54;
      setHealthInfo(prev => ({...prev, height: heightCm.toFixed(1)}));
    }
  }, [feet, inches, units, isEditing]);

  // Update weight when pounds change
  useEffect(() => {
    if (units === "imperial" && isEditing) {
      const weightKg = weightLbs / 2.20462;
      setHealthInfo(prev => ({...prev, weight: weightKg.toFixed(1)}));
    }
  }, [weightLbs, units, isEditing]);

  const handleUnitChange = (value: "imperial" | "metric") => {
    setUnits(value);
  };

  const handleSave = () => {
    if (user) {
      // In a real app, we would save this to a backend
      // For now, we'll just update the localStorage data
      
      // Save health info
      localStorage.setItem(`healthInfo-${user.id}`, JSON.stringify(healthInfo));
      
      // We can't really update the user record without a backend,
      // but we could demonstrate the flow anyway
      toast.success("Profile updated successfully");
      setIsEditing(false);
    }
  };

  const handleHealthInfoChange = (key: string, value: string) => {
    setHealthInfo(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayHeight = () => {
    if (units === "imperial") {
      return `${feet}' ${inches}"`;
    } else {
      return `${healthInfo.height} cm`;
    }
  };

  const displayWeight = () => {
    if (units === "imperial") {
      return `${weightLbs} lbs`;
    } else {
      return `${healthInfo.weight} kg`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar currentPage="profile" />
      
      <div className="container mx-auto pt-8 pb-16 px-4 md:pl-64 md:pr-4 max-w-2xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Your Profile</h1>
        </div>

        {user && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <UserRound className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Health Information</h3>

              {isEditing && (
                <div className="mb-4">
                  <RadioGroup 
                    value={units} 
                    onValueChange={(value) => handleUnitChange(value as "imperial" | "metric")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="imperial" id="imperial-profile" />
                      <Label htmlFor="imperial-profile">US Units</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="metric" id="metric-profile" />
                      <Label htmlFor="metric-profile">Metric</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      value={healthInfo.age}
                      onChange={(e) => handleHealthInfoChange("age", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Weight</Label>
                    {isEditing && units === "imperial" ? (
                      <div className="flex items-center gap-2">
                        <Input 
                          id="weight-lbs" 
                          type="number"
                          value={weightLbs}
                          onChange={(e) => setWeightLbs(Number(e.target.value))}
                          className="w-20"
                        />
                        <span>lbs</span>
                      </div>
                    ) : (
                      <Input 
                        id="weight" 
                        value={isEditing ? healthInfo.weight : displayWeight()}
                        onChange={(e) => handleHealthInfoChange("weight", e.target.value)}
                        readOnly={!isEditing || units === "imperial"}
                      />
                    )}
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="height">Height</Label>
                    {isEditing && units === "imperial" ? (
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
                    ) : (
                      <Input 
                        id="height" 
                        value={isEditing ? healthInfo.height : displayHeight()}
                        onChange={(e) => handleHealthInfoChange("height", e.target.value)}
                        readOnly={!isEditing || units === "imperial"}
                      />
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="sleepHours">Sleep (hours)</Label>
                    <Input 
                      id="sleepHours" 
                      value={healthInfo.sleepHours}
                      onChange={(e) => handleHealthInfoChange("sleepHours", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="conditions">Medical Conditions</Label>
                  <Input 
                    id="conditions" 
                    value={healthInfo.conditions}
                    onChange={(e) => handleHealthInfoChange("conditions", e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-between">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="text-destructive border-destructive hover:bg-destructive/10"
                  >
                    Log Out
                  </Button>
                  <Button 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
