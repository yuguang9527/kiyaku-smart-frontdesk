
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ChatBubble from './ChatBubble';
import { useToast } from '@/components/ui/use-toast';
import { generateResponse } from '@/services/groq';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

// AIとの会話履歴用の型（Groq APIに渡す用）
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
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
  hotelInfo = { name: 'Yotta!', greeting: '' }
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 最近の会話履歴を保存
  const conversationHistoryRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    const getInitialGreeting = async () => {
      try {
        // SystemメッセージはGroq APIに直接渡さず、ここで初期メッセージを生成
        const greeting = await generateResponse([{
          role: 'user',
          content: 'お客様への初めての挨拶をお願いします。'
        }]);
        
        setMessages([{
          id: '1',
          content: greeting,
          isUser: false,
          timestamp: formatTime()
        }]);
        
        // 初期メッセージをチャット履歴に保存
        conversationHistoryRef.current.push({
          role: 'assistant',
          content: greeting
        });
      } catch (error) {
        console.error('Error getting initial greeting:', error);
        // AIが失敗した場合の基本的な挨拶
        const fallbackGreeting = 'いらっしゃいませ。ご質問があればお気軽にどうぞ。';
        setMessages([{
          id: '1',
          content: fallbackGreeting,
          isUser: false,
          timestamp: formatTime()
        }]);
        
        conversationHistoryRef.current.push({
          role: 'assistant',
          content: fallbackGreeting
        });
      }
    };

    getInitialGreeting();
  }, []);

  // 最新メッセージに自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    
    // 会話履歴を更新
    conversationHistoryRef.current.push({
      role: 'user',
      content: inputMessage
    });
    
    try {
      // 会話履歴をAPIに渡す（最大10メッセージまで）
      const recentMessages = [...conversationHistoryRef.current].slice(-10);
      
      const aiResponse = await generateResponse(recentMessages);
      
      // AIの返答を会話履歴に追加
      conversationHistoryRef.current.push({
        role: 'assistant',
        content: aiResponse
      });
      
      // 会話履歴を適切なサイズに保つ
      if (conversationHistoryRef.current.length > 20) {
        conversationHistoryRef.current = conversationHistoryRef.current.slice(-20);
      }
      
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
        
        <div ref={messagesEndRef} />
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
