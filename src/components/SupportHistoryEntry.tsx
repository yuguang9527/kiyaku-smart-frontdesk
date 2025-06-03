
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface SupportHistoryEntryProps {
  entry: {
    id: string;
    timestamp: string;
    agent: string;
    action: string;
    details: string;
    hasChat?: boolean;
  };
  isCompleted: boolean;
  onClick?: () => void;
  onToggleStatus: (entryId: string, event: React.MouseEvent) => void;
}

const SupportHistoryEntry: React.FC<SupportHistoryEntryProps> = ({
  entry,
  isCompleted,
  onClick,
  onToggleStatus
}) => {
  const { language } = useLanguage();

  return (
    <div 
      className={`cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors ${
        entry.hasChat ? '' : 'cursor-default'
      }`}
      onClick={() => entry.hasChat ? onClick?.() : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {entry.timestamp}
          </span>
          {entry.hasChat && (
            <Badge variant="secondary" className="text-xs">
              {language === 'ja' ? 'チャット詳細あり' : 'Chat Available'}
            </Badge>
          )}
          <Button
            variant={isCompleted ? "default" : "outline"}
            size="sm"
            className={`text-xs h-6 px-2 ${
              isCompleted 
                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }`}
            onClick={(e) => onToggleStatus(entry.id, e)}
          >
            {isCompleted 
              ? (language === 'ja' ? '完了' : 'Completed')
              : (language === 'ja' ? '対応中' : 'In Progress')
            }
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{entry.agent}</span>
          {entry.hasChat && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      
      <div className="ml-6">
        <h4 className="font-medium text-sm">{entry.action}</h4>
        <p className="text-sm text-muted-foreground mt-1">
          {entry.details}
        </p>
      </div>
    </div>
  );
};

export default SupportHistoryEntry;
