
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { formatTime } from './utils';
import { Message, ChatInterfaceProps } from './types';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { chatHistoryService } from '@/services/chatHistory';
import { apiService } from '@/services/api';

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  title,
  hotelInfo,
  reservationNumber
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history and add greeting message on component mount
  useEffect(() => {
    if (reservationNumber) {
      // Load existing chat history for this reservation
      const existingHistory = chatHistoryService.getChatHistory(reservationNumber);
      
      if (existingHistory && existingHistory.messages.length > 0) {
        // Load existing messages
        setMessages(existingHistory.messages);
      } else if (hotelInfo) {
        // Add greeting message for new conversation
        const greetingMessage: Message = {
          id: uuidv4(),
          content: hotelInfo.greeting,
          isUser: false,
          timestamp: formatTime(),
        };
        setMessages([greetingMessage]);
      }
    } else if (hotelInfo) {
      // No reservation number, just show greeting
      const greetingMessage: Message = {
        id: uuidv4(),
        content: hotelInfo.greeting,
        isUser: false,
        timestamp: formatTime(),
      };
      setMessages([greetingMessage]);
    }
  }, [hotelInfo, reservationNumber]);

  // Save chat history whenever messages change
  useEffect(() => {
    if (reservationNumber && messages.length > 0) {
      chatHistoryService.saveChatHistory(reservationNumber, messages);
    }
  }, [messages, reservationNumber]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      isUser: true,
      timestamp: formatTime(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Use actual API call to backend with Claude
      const sessionId = reservationNumber || `session-${Date.now()}`;
      const response = await apiService.sendChatMessage(
        content,
        sessionId,
        undefined, // userId - can be added later if needed
        hotelInfo?.id || 'yotta-hotel-1' // use hotel ID from props or default
      );
      
      const botMessage: Message = {
        id: uuidv4(),
        content: response.data?.response || 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: formatTime(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat API error:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white flex flex-col h-[500px]">
      {title && (
        <div className="border-b px-4 py-2 bg-blue-50">
          <h3 className="text-lg font-medium text-blue-900">{title}</h3>
          {reservationNumber && (
            <p className="text-sm text-blue-600">予約番号: {reservationNumber}</p>
          )}
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
