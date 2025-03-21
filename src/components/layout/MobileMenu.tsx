
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  MessageSquare, 
  Settings, 
  User, 
  History,
  LogOut
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

type MobileMenuProps = {
  currentPage: "home" | "chat" | "settings" | "profile" | "history";
};

export const MobileMenu = ({ currentPage }: MobileMenuProps) => {
  const { logout } = useUser();
  const [open, setOpen] = useState(false);
  
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

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] rounded-t-[10px]">
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center border-b pb-4 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-xl ml-2">Hearth</span>
          </div>
          
          <div className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => (
              <DrawerClose key={item.name} asChild>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={`justify-start ${item.active ? 'bg-primary text-primary-foreground' : ''}`}
                  asChild
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    {item.icon}
                    {item.name}
                  </Link>
                </Button>
              </DrawerClose>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-auto">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
