
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { generateResponse } from '@/services/groq';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { Message, ChatMessage, ChatInterfaceProps } from './types';
import { formatTime } from './utils';

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  title,
  hotelInfo = { name: 'Yotta!', greeting: '' }
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
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

  const handleSendMessage = async (inputMessage: string) => {
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: formatTime()
    };
    
    setMessages(prev => [...prev, userMessage]);
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

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-white shadow-sm">
      {title && (
        <div className="p-3 border-b bg-muted/30">
          <h3 className="font-medium">{title}</h3>
        </div>
      )}
      
      <ChatMessageList 
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;
