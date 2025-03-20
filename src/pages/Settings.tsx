
import { useState, useEffect } from "react";
import { 
  Palette, 
  VolumeX, 
  Volume2, 
  ArrowLeft, 
  Moon, 
  Sun,
  Bell,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { useUser } from "@/context/UserContext";

const Settings = () => {
  const { user } = useUser();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "teal";
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved !== "false";
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem("soundEnabled");
    return saved !== "false";
  });

  useEffect(() => {
    // Apply theme on load
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [theme, darkMode]);

  const toggleTheme = () => {
    const newTheme = theme === "teal" ? "purple" : "teal";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    document.documentElement.classList.toggle("dark", newMode);
    toast.success(`${newMode ? "Dark" : "Light"} mode enabled`);
  };

  const toggleNotifications = () => {
    const newState = !notifications;
    setNotifications(newState);
    localStorage.setItem("notifications", String(newState));
    toast.success(`Notifications ${newState ? "enabled" : "disabled"}`);
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem("soundEnabled", String(newState));
    toast.success(`Sound ${newState ? "enabled" : "disabled"}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar currentPage="settings" />
      
      <div className="container mx-auto pt-8 pb-16 px-4 md:pl-64 md:pr-4 max-w-2xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {darkMode ? 
                  <Moon className="h-5 w-5 text-primary" /> : 
                  <Sun className="h-5 w-5 text-primary" />
                }
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={toggleDarkMode} 
              />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Theme Color</h3>
                  <p className="text-sm text-muted-foreground">
                    Switch between teal and purple themes
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleTheme}
                className="min-w-24"
              >
                {theme === "teal" ? "Teal" : "Purple"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable all notifications
                  </p>
                </div>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={toggleNotifications} 
              />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {soundEnabled ? 
                  <Volume2 className="h-5 w-5 text-primary" /> : 
                  <VolumeX className="h-5 w-5 text-primary" />
                }
                <div>
                  <h3 className="font-medium">Sound</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable sound effects
                  </p>
                </div>
              </div>
              <Switch 
                checked={soundEnabled} 
                onCheckedChange={toggleSound} 
              />
            </div>
          </Card>

          <Separator />

          <div className="text-center text-sm text-muted-foreground">
            <p>Hearth - AI Health Assistant</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
