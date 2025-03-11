
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ChatHistoryProps {
  userId?: string | null;
  onSelectConversation: (conversation: any) => void;
}

export const ChatHistory = ({ userId, onSelectConversation }: ChatHistoryProps) => {
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    loadConversations();
  }, [userId]);

  const loadConversations = () => {
    // Group all user's conversations by date
    const allKeys = Object.keys(localStorage);
    const chatKeys = userId 
      ? allKeys.filter(key => key.startsWith(`chatHistory-${userId}`))
      : allKeys.filter(key => key === 'tempChatHistory');
    
    const chats = chatKeys.map(key => {
      const messagesJson = localStorage.getItem(key);
      if (!messagesJson) return null;
      
      const messages = JSON.parse(messagesJson);
      if (!messages.length) return null;
      
      // Get first and last message for preview
      const firstMessage = messages[0];
      const lastMessage = messages[messages.length - 1];
      const lastTimestamp = lastMessage.timestamp ? new Date(lastMessage.timestamp) : new Date();
      const preview = firstMessage.content.substring(0, 50) + (firstMessage.content.length > 50 ? '...' : '');
      
      return {
        id: key,
        preview,
        messageCount: messages.length,
        lastUpdated: lastTimestamp,
        messages
      };
    }).filter(Boolean);
    
    // Sort by last updated
    chats.sort((a, b) => {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
    
    setConversations(chats);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      localStorage.removeItem(id);
      setConversations(conversations.filter(conv => conv.id !== id));
      toast.success("Conversation deleted");
    }
  };

  return (
    <div className="w-full max-w-4xl animate-fadeIn space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Conversations</h2>
      </div>
      
      {conversations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No conversations yet. Start chatting!
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map(conversation => (
            <div 
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className="p-4 rounded-lg border border-border hover:bg-accent/20 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {new Date(conversation.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={(e) => deleteConversation(conversation.id, e)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{conversation.preview}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs">{conversation.messageCount} messages</span>
                <span className="text-xs text-muted-foreground">
                  Last message: {new Date(conversation.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
