
import { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, ArrowLeft } from "lucide-react";

const Chat = () => {
  const { user, logout } = useUser();
  const [viewingHistory, setViewingHistory] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    setViewingHistory(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setViewingHistory(!viewingHistory)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          {viewingHistory ? "Back to Chat" : "View History"}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="flex items-center gap-2 text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
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
                className="flex items-center gap-2"
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
