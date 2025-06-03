
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import ChatBubble from '@/components/ChatBubble';
import CommentForm from '@/components/CommentForm';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  isHotelComment?: boolean;
}

interface ChatViewProps {
  entry: {
    id: string;
    action: string;
    timestamp: string;
  } | undefined;
  messages: ChatMessage[];
  isCompleted: boolean;
  onSubmitComment: (data: { comment: string }) => void;
  onMarkComplete: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  entry,
  messages,
  isCompleted,
  onSubmitComment,
  onMarkComplete
}) => {
  const { language } = useLanguage();

  if (!entry) return null;

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {language === 'ja' ? 'チャット履歴がありません' : 'No chat history available'}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 pb-4 border-b">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{entry.action}</h4>
              <p className="text-sm text-muted-foreground">{entry.timestamp}</p>
            </div>
            <Badge 
              variant={isCompleted ? "default" : "secondary"}
              className={isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {isCompleted 
                ? (language === 'ja' ? '完了' : 'Completed')
                : (language === 'ja' ? '対応中' : 'In Progress')
              }
            </Badge>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 h-[200px]">
        <div className="space-y-4 pr-4">
          {messages.map((message: ChatMessage) => (
            <div key={message.id}>
              <ChatBubble
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
              {message.isHotelComment && (
                <div className="text-xs text-blue-600 ml-4 mt-1">
                  {language === 'ja' ? 'ホテルスタッフコメント' : 'Hotel Staff Comment'}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4" />

      <CommentForm
        onSubmit={onSubmitComment}
        onMarkComplete={onMarkComplete}
        isCompleted={isCompleted}
      />
    </div>
  );
};

export default ChatView;
