
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
import { LogOut, MessageSquare, ArrowLeft, Settings, Menu } from "lucide-react";

const Chat = () => {
  const { user, logout } = useUser();
  const [viewingHistory, setViewingHistory] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    setViewingHistory(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-0 bg-background w-full">
      <div className="stethoscope-pattern"></div>
      
      <div className="w-full bg-gradient-to-r from-primary/10 to-primary/5 py-4 px-8 flex justify-between items-center mb-4 border-b border-primary/20">
        <h1 className="text-2xl font-bold text-primary">Health Assistant</h1>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="default" 
            onClick={() => setViewingHistory(!viewingHistory)}
            className="flex items-center gap-2 border-primary/30 text-primary"
          >
            <MessageSquare className="h-5 w-5" />
            {viewingHistory ? "Back to Chat" : "History"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-primary/30">
                <Menu className="h-5 w-5 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-5 w-5" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {viewingHistory ? (
        <div className="w-full px-8">
          <ChatHistory 
            userId={user?.id} 
            onSelectConversation={handleSelectConversation} 
          />
        </div>
      ) : (
        <div className="w-full px-4">
          {selectedConversation && (
            <div className="w-full mb-4 px-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedConversation(null)}
                className="flex items-center gap-2 mb-2 text-primary"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to new chat
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
