
import { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, MessageSquare, ArrowLeft, Settings, Menu, Home, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { user, logout } = useUser();
  const [viewingHistory, setViewingHistory] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const navigate = useNavigate();

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    setViewingHistory(false);
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-0 bg-background w-full">
      <div className="stethoscope-pattern"></div>
      
      <div className="w-full bg-background shadow-sm border-b border-primary/20 py-3 px-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNavigateHome}
          className="text-primary flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
        
        <h1 className="text-xl font-semibold text-primary">Chat Assistant</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewingHistory(!viewingHistory)}
            className="flex items-center gap-1 border-primary/30 text-primary hidden sm:flex"
          >
            <MessageSquare className="h-4 w-4" />
            {viewingHistory ? "Back to Chat" : "History"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 border-primary/30">
                <Menu className="h-4 w-4 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer sm:hidden"
                onClick={() => setViewingHistory(!viewingHistory)}
              >
                <MessageSquare className="h-4 w-4" />
                {viewingHistory ? "Back to Chat" : "History"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4" />
                Home
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {viewingHistory ? (
        <div className="w-full px-4 py-4">
          <ChatHistory 
            userId={user?.id} 
            onSelectConversation={handleSelectConversation} 
          />
        </div>
      ) : (
        <div className="w-full flex-1">
          {selectedConversation && (
            <div className="w-full px-4 py-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedConversation(null)}
                className="flex items-center gap-2 text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                New chat
              </Button>
            </div>
          )}
          <ChatInterface 
            onSend={() => {}} 
            userId={user?.id} 
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
