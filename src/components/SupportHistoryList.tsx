
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import SupportHistoryEntry from '@/components/SupportHistoryEntry';

interface HistoryEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  details: string;
  hasChat?: boolean;
}

interface SupportHistoryListProps {
  history: HistoryEntry[];
  completedEntries: Set<string>;
  onEntryClick: (entryId: string) => void;
  onToggleEntryStatus: (entryId: string, event: React.MouseEvent) => void;
}

const SupportHistoryList: React.FC<SupportHistoryListProps> = ({
  history,
  completedEntries,
  onEntryClick,
  onToggleEntryStatus
}) => {
  const { language } = useLanguage();

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((entry, index) => (
            <div key={entry.id} className="space-y-2">
              <SupportHistoryEntry
                entry={entry}
                isCompleted={completedEntries.has(entry.id)}
                onClick={() => onEntryClick(entry.id)}
                onToggleStatus={onToggleEntryStatus}
              />
              
              {index < history.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {language === 'ja' ? '対応履歴がありません' : 'No support history available'}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default SupportHistoryList;
