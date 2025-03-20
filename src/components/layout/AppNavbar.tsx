
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { 
  Home, 
  MessageSquare, 
  Settings, 
  User, 
  History,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavbarProps = {
  currentPage: "home" | "chat" | "settings" | "profile" | "history";
};

export const AppNavbar = ({ currentPage }: NavbarProps) => {
  const { user, logout } = useUser();

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-5 w-5" />,
      active: currentPage === "home"
    },
    {
      name: "Chat",
      path: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
      active: currentPage === "chat"
    },
    {
      name: "History",
      path: "/history",
      icon: <History className="h-5 w-5" />,
      active: currentPage === "history"
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="h-5 w-5" />,
      active: currentPage === "profile"
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      active: currentPage === "settings"
    }
  ];

  if (!user) return null;

  return (
    <>
      {/* Mobile header with hamburger menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background z-50 border-b">
        <div className="flex justify-between items-center p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">Hearth</span>
          </Link>
          
          <MobileMenu currentPage={currentPage} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 border-r bg-background z-50">
        <div className="flex flex-col h-full py-8 px-4">
          <Link to="/" className="flex items-center gap-2 mb-8 px-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-xl">Hearth</span>
          </Link>
          
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={item.active ? "default" : "ghost"}
                className={`justify-start ${item.active ? 'bg-primary text-primary-foreground' : ''}`}
                asChild
              >
                <Link to={item.path} className="flex items-center gap-3">
                  {item.icon}
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
          
          <div className="mt-auto pt-4 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content padding for desktop */}
      <div className="hidden md:block w-64" />
    </>
  );
};
