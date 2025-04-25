
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ChatBubble from './ChatBubble';
import { useToast } from '@/components/ui/use-toast';
import { generateResponse } from '@/services/groq';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatInterfaceProps {
  title: string;
  hotelInfo?: {
    name: string;
    greeting: string;
  };
}

const formatTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  title,
  hotelInfo = { name: 'Yotta!', greeting: 'いらっしゃいませ。ご質問があればお気軽にどうぞ。' }
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: hotelInfo.greeting,
      isUser: false,
      timestamp: formatTime()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: formatTime()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const groqMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      groqMessages.push({ role: 'user', content: inputMessage });

      const aiResponse = await generateResponse(groqMessages);
      
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: formatTime()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "メッセージを送信できませんでした。もう一度お試しください。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-3 border-b bg-muted/30">
        <h3 className="font-medium">{title}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground animate-pulse">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary animation-delay-200"></div>
            <div className="w-2 h-2 rounded-full bg-primary animation-delay-500"></div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
