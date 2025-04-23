
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
  timestamp?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser = false,
  timestamp
}) => {
  return (
    <div className={cn(
      "flex w-full mb-4 max-w-[85%]",
      isUser ? "ml-auto justify-end" : "mr-auto justify-start"
    )}>
      <div className={cn(
        "rounded-lg p-3 shadow",
        isUser ? "bg-primary text-white" : "bg-muted"
      )}>
        <p className="text-sm whitespace-pre-line">{message}</p>
        {timestamp && (
          <div className={cn(
            "text-xs mt-1 text-right",
            isUser ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
