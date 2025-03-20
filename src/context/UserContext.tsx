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
    // Check for saved user in localStorage on page load
    const checkUserAuth = () => {
      setIsLoading(true);
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    checkUserAuth();
    
    // Listen for storage events (when localStorage changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error("Error parsing user from storage event:", error);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simple validation
      if (!email) {
        toast.error("Please enter your email");
        return false;
      }
      
      if (!password) {
        toast.error("Please enter your password");
        return false;
      }
      
      // For demo purposes, check if we have a user with this email in localStorage
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const existingUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          // In a real app, we'd verify the password hash here
          // For demo, we'll just compare plaintext (not secure for real apps!)
          if (existingUser.password !== password) {
            toast.error("Invalid password");
            return false;
          }
          
          // Remove password before setting to state
          const { password: _, ...userWithoutPassword } = existingUser;
          
          // Set user in state and localStorage
          setUser(userWithoutPassword);
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          
          toast.success(`Welcome back, ${existingUser.name}!`);
          return true;
        } else {
          toast.error("No account found with this email");
          return false;
        }
      }
      
      // If no users yet, create demo user for testing
      const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, "");
      const newUser = {
        id: userId,
        name: email.split('@')[0],
        email
      };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      
      // For demo purposes, also add to users collection
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      users.push({...newUser, password});
      localStorage.setItem("users", JSON.stringify(users));
      
      setUser(newUser);
      
      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simple validation
      if (!name) {
        toast.error("Please enter your name");
        return false;
      }
      
      if (!email) {
        toast.error("Please enter your email");
        return false;
      }
      
      if (!password) {
        toast.error("Please enter a password");
        return false;
      }
      
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
      
      // Check if user already exists
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const existingUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          toast.error("An account with this email already exists");
          return false;
        }
      }
      
      // Create a new user with a stable ID based on email
      const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, "");
      const newUser = {
        id: userId,
        name,
        email
      };
      
      // Save user to localStorage (without password)
      localStorage.setItem("user", JSON.stringify(newUser));
      
      // For a real app, you'd hash the password before storing
      // Also store in users collection for demo
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      users.push({...newUser, password});
      localStorage.setItem("users", JSON.stringify(users));
      
      setUser(newUser);
      
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("theme");
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
