
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // For demo purposes, we'll just simulate a successful login
      // In a real app, you'd validate credentials against a backend
      
      // Simple validation
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return false;
      }
      
      // Create a demo user with a stable ID based on email
      const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, "");
      const newUser = {
        id: userId,
        name: email.split('@')[0],
        email
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Simple validation
      if (!name || !email || !password) {
        toast.error("Please fill in all fields");
        return false;
      }
      
      // Create a demo user with a stable ID based on email
      const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, "");
      const newUser = {
        id: userId,
        name,
        email
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Registration failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("You have been logged out");
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
