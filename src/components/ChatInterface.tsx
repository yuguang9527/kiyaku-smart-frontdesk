
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
  
  // 存储最近的用户问题和AI回答，用于避免重复回答
  const previousMessagesRef = useRef<{
    questions: string[];
    responses: string[];
  }>({
    questions: [],
    responses: []
  });

  useEffect(() => {
    const getInitialGreeting = async () => {
      try {
        const greeting = await generateResponse([{
          role: 'system',
          content: '你是一位热情友好的旅馆接待员。请用日语向客人问好，简短问候即可，不要重复相同的问候语。'
        }, {
          role: 'user',
          content: 'お客様への初めての挨拶をお願いします。'
        }]);
        
        setMessages([{
          id: '1',
          content: greeting,
          isUser: false,
          timestamp: formatTime()
        }]);
      } catch (error) {
        console.error('Error getting initial greeting:', error);
        // Fallback to a basic greeting if AI fails
        setMessages([{
          id: '1',
          content: 'いらっしゃいませ。ご質問があればお気軽にどうぞ。',
          isUser: false,
          timestamp: formatTime()
        }]);
      }
    };

    getInitialGreeting();
  }, []);

  // 自动滚动到最新消息
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
    
    // 检查是否问了相同的问题
    const isDuplicateQuestion = previousMessagesRef.current.questions.includes(inputMessage);
    
    try {
      const groqMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      
      // 添加系统提示，避免重复回答
      groqMessages.unshift({
        role: 'system',
        content: `你是一位热情友好的日本旅馆接待员。请用日语回答客人的问题。
        1. 回答要简洁明了
        2. 不要重复以前回答过的相同内容
        3. 如果客人问了相同的问题，请给出不同的回答方式
        4. 当被问到关于旅馆的信息，请根据系统提供的信息回答`
      });
      
      groqMessages.push({ role: 'user', content: inputMessage });
      
      // 如果是重复问题，提醒AI不要重复之前的回答
      if (isDuplicateQuestion) {
        groqMessages.push({
          role: 'system',
          content: '注意：客人正在重复问相同的问题。请提供不同的回答方式，避免完全重复之前的回答。'
        });
      }

      const aiResponse = await generateResponse(groqMessages);
      
      // 存储问题和回答，用于后续检查重复
      previousMessagesRef.current.questions.push(inputMessage);
      previousMessagesRef.current.responses.push(aiResponse);
      
      // 保持历史记录在合理范围内
      if (previousMessagesRef.current.questions.length > 10) {
        previousMessagesRef.current.questions.shift();
        previousMessagesRef.current.responses.shift();
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
