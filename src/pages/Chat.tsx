
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chat</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewingHistory(!viewingHistory)}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {viewingHistory ? "Back to Chat" : "History"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {viewingHistory ? (
        <ChatHistory 
          userId={user?.id} 
          onSelectConversation={handleSelectConversation} 
        />
      ) : (
        <>
          {selectedConversation && (
            <div className="w-full max-w-4xl mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedConversation(null)}
                className="flex items-center gap-2 mb-2 -ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to new chat
              </Button>
            </div>
          )}
          <ChatInterface 
            onSend={() => {}} 
            userId={user?.id} 
          />
        </>
      )}
    </div>
  );
};

export default Chat;
