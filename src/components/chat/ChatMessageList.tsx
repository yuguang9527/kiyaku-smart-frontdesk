
import React from 'react';
import ChatBubble from '@/components/ChatBubble';
import { Message } from './types';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading,
  messagesEndRef
}) => {
  return (
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
  );
};

export default ChatMessageList;
