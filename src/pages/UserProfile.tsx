import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        setHealthInfo(JSON.parse(savedHealthInfo));
      }
    }
  }, [user, isLoading, navigate]);

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
      
      <div className="container max-w-2xl py-8 px-4">
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input 
                      id="weight" 
                      value={healthInfo.weight}
                      onChange={(e) => handleHealthInfoChange("weight", e.target.value)}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                      id="height" 
                      value={healthInfo.height}
                      onChange={(e) => handleHealthInfoChange("height", e.target.value)}
                      readOnly={!isEditing}
                    />
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
