
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { ChatHistory } from "@/components/chat/ChatHistory";

const History = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const handleSelectConversation = (conversation: any) => {
    // In a real app, you would store the selected conversation in a context
    // and then navigate to the chat page
    // For now, we'll just navigate to the chat page
    localStorage.setItem("currentConversation", conversation.id);
    navigate("/chat");
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
      <AppNavbar currentPage="history" />
      
      <div className="container py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Chat History</h1>
        </div>

        <ChatHistory 
          userId={user?.id} 
          onSelectConversation={handleSelectConversation} 
        />
      </div>
    </div>
  );
};

export default History;
