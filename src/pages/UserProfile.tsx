
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, UserRound, Mail, Save, CalendarIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { toast } from "sonner";
import { format, parse } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const UserProfile = () => {
  const { user, isLoading, logout } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [manualDateInput, setManualDateInput] = useState("");
  const [calendar, setCalendar] = useState<{
    month: Date;
    year: number;
    view: "day" | "month" | "year";
  }>({
    month: new Date(),
    year: new Date().getFullYear(),
    view: "day",
  });
  const [healthInfo, setHealthInfo] = useState({
    weight: "",
    height: "",
    sleepHours: "7",
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
        
        // Set birthdate if exists
        if (parsedInfo.birthdate) {
          const date = new Date(parsedInfo.birthdate);
          setBirthdate(date);
          setManualDateInput(format(date, "yyyy-MM-dd"));
          setCalendar({ 
            month: date, 
            year: date.getFullYear(),
            view: "day" 
          });
        }
        
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
      // Save birthdate with health info
      const updatedHealthInfo = {
        ...healthInfo,
        birthdate: birthdate ? birthdate.toISOString() : undefined
      };
      
      // Save to localStorage
      localStorage.setItem(`healthInfo-${user.id}`, JSON.stringify(updatedHealthInfo));
      
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
    // Note: The redirect is now handled in the UserContext logout function
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

  const calculateAge = () => {
    if (!birthdate) return "";
    
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    
    return `${age} years`;
  };

  // Handle manual date input
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setManualDateInput(inputValue);
    
    // Try to parse the date
    try {
      if (inputValue) {
        const parsedDate = parse(inputValue, "yyyy-MM-dd", new Date());
        if (!isNaN(parsedDate.getTime())) {
          setBirthdate(parsedDate);
          setCalendar({
            month: parsedDate,
            year: parsedDate.getFullYear(),
            view: "day"
          });
        }
      }
    } catch (error) {
      console.error("Invalid date format:", error);
    }
  };

  // Handle calendar view change
  const handleCalendarViewChange = (view: "day" | "month" | "year") => {
    setCalendar(prev => ({ ...prev, view }));
  };

  // Handle year selection
  const handleYearSelect = (year: number) => {
    setCalendar(prev => ({ 
      ...prev, 
      year,
      view: "month"
    }));
  };

  // Handle month selection
  const handleMonthSelect = (month: number) => {
    const newDate = new Date(calendar.year, month);
    setCalendar(prev => ({ 
      ...prev, 
      month: newDate,
      view: "day"
    }));
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

  // Generate year options: 100 years back from current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  
  // Month names
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

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
                <div className="grid gap-2">
                  <Label htmlFor="birthdate">Date of Birth</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="birthdate-manual"
                          type="date"
                          value={manualDateInput}
                          onChange={handleDateInputChange}
                          className="flex-1"
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="birthdate"
                              variant="outline"
                              className="flex-none"
                            >
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            {calendar.view === "day" && (
                              <div className="p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCalendarViewChange("month")}
                                  >
                                    {format(calendar.month, "MMMM yyyy")}
                                  </Button>
                                </div>
                                <Calendar
                                  mode="single"
                                  selected={birthdate}
                                  onSelect={setBirthdate}
                                  month={calendar.month}
                                  onMonthChange={(newMonth) => setCalendar(prev => ({ ...prev, month: newMonth }))}
                                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                  initialFocus
                                  className={cn("p-0 pointer-events-auto")}
                                />
                              </div>
                            )}
                            
                            {calendar.view === "month" && (
                              <div className="p-3">
                                <div className="flex justify-between items-center mb-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCalendarViewChange("year")}
                                  >
                                    {calendar.year}
                                  </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {months.map((month, idx) => (
                                    <Button
                                      key={month}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleMonthSelect(idx)}
                                      className="h-10"
                                    >
                                      {month.substring(0, 3)}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {calendar.view === "year" && (
                              <div className="p-3">
                                <div className="h-[300px] overflow-y-auto">
                                  <div className="grid grid-cols-3 gap-2">
                                    {years.map((year) => (
                                      <Button
                                        key={year}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleYearSelect(year)}
                                      >
                                        {year}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <Input 
                        value={birthdate ? format(birthdate, "PPP") : "Not specified"}
                        readOnly
                      />
                      {birthdate && (
                        <div className="ml-4 text-sm text-muted-foreground">
                          {calculateAge()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
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
