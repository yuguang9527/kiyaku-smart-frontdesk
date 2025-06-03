import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { ReservationUpdateHistory } from '@/types/reservation';
import { Button } from '@/components/ui/button';
import { chatHistoryService } from '@/services/chatHistory';
import SupportHistoryList from '@/components/SupportHistoryList';
import ChatView from '@/components/ChatView';

interface SupportHistoryDialogProps {
  reservationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  updateHistory?: ReservationUpdateHistory[];
  onStatusChange?: (inquiryId: string, isCompleted: boolean) => void;
}

interface CommentForm {
  comment: string;
}

const SupportHistoryDialog: React.FC<SupportHistoryDialogProps> = ({
  reservationId,
  isOpen,
  onClose,
  updateHistory = [],
  onStatusChange
}) => {
  const { language } = useLanguage();
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [completedEntries, setCompletedEntries] = useState<Set<string>>(new Set());

  const supportHistory = [
    {
      id: 'support-001',
      timestamp: '2025/04/20 14:30',
      agent: 'AIスタッフ',
      action: language === 'ja' ? 'チェックイン手続き案内' : 'Check-in procedure guidance',
      details: language === 'ja' ? '到着時間の確認とチェックイン手続きについて案内しました。' : 'Confirmed arrival time and provided check-in procedure guidance.',
      hasChat: true,
      reservationNumber: 'RES001'
    },
    {
      id: 'support-002',
      timestamp: '2025/04/21 09:15',
      agent: 'AIスタッフ',
      action: language === 'ja' ? '朝食時間問い合わせ対応' : 'Breakfast time inquiry',
      details: language === 'ja' ? '朝食提供時間について回答しました。' : 'Provided information about breakfast serving hours.',
      hasChat: true,
      reservationNumber: 'RES002'
    },
    {
      id: 'support-003',
      timestamp: '2025/04/21 16:45',
      agent: 'AIスタッフ',
      action: language === 'ja' ? '周辺観光地案内' : 'Local attractions guidance',
      details: language === 'ja' ? '近隣の観光スポットとアクセス方法を案内しました。' : 'Provided information about nearby tourist attractions and access methods.',
      hasChat: true,
      reservationNumber: 'RES003'
    }
  ];

  const combinedHistory = [
    ...supportHistory,
    ...updateHistory
      .filter(update => update.reservationId === reservationId)
      .map(update => ({
        id: update.id,
        timestamp: update.timestamp,
        agent: update.agent,
        action: update.action,
        details: update.changes,
        hasChat: false
      }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getChatHistory = (entryId: string) => {
    const entry = supportHistory.find(e => e.id === entryId);
    if (!entry || !entry.reservationNumber) return null;

    const realChatHistory = chatHistoryService.getChatHistory(entry.reservationNumber);
    if (realChatHistory) {
      return realChatHistory.messages;
    }

    const sampleChats: { [key: string]: any[] } = {
      'support-001': [
        {
          id: 'msg1',
          content: language === 'ja' ? 'こんにちは。チェックイン手続きについて教えてください。' : 'Hello. Could you tell me about the check-in procedure?',
          isUser: true,
          timestamp: '14:30'
        },
        {
          id: 'msg2',
          content: language === 'ja' ? 'お疲れさまです。チェックインは15:00から承っております。お客様の到着予定時刻を教えていただけますでしょうか？' : 'Thank you for contacting us. Check-in is available from 3:00 PM. Could you please tell me your expected arrival time?',
          isUser: false,
          timestamp: '14:31'
        },
        {
          id: 'msg3',
          content: language === 'ja' ? '16:00頃に到着予定です。' : 'I plan to arrive around 4:00 PM.',
          isUser: true,
          timestamp: '14:32'
        },
        {
          id: 'msg4',
          content: language === 'ja' ? 'ありがとうございます。16:00のご到着でしたら、スムーズにチェックインしていただけます。フロントにてお待ちしております。' : 'Thank you. If you arrive at 4:00 PM, you will be able to check in smoothly. We will be waiting for you at the front desk.',
          isUser: false,
          timestamp: '14:33'
        }
      ],
      'support-002': [
        {
          id: 'msg1',
          content: language === 'ja' ? '朝食の時間を教えてください。' : 'Could you tell me the breakfast hours?',
          isUser: true,
          timestamp: '09:15'
        },
        {
          id: 'msg2',
          content: language === 'ja' ? 'おはようございます。朝食は7:00から10:00まで、1階のレストランにてご提供しております。' : 'Good morning. Breakfast is served from 7:00 AM to 10:00 AM at the restaurant on the first floor.',
          isUser: false,
          timestamp: '09:16'
        },
        {
          id: 'msg3',
          content: language === 'ja' ? 'ありがとうございます。予約は必要ですか？' : 'Thank you. Do I need a reservation?',
          isUser: true,
          timestamp: '09:17'
        },
        {
          id: 'msg4',
          content: language === 'ja' ? 'ご宿泊のお客様は予約不要です。直接レストランへお越しください。' : 'Hotel guests do not need reservations. Please come directly to the restaurant.',
          isUser: false,
          timestamp: '09:18'
        }
      ],
      'support-003': [
        {
          id: 'msg1',
          content: language === 'ja' ? '近くの観光地を教えてください。' : 'Could you tell me about nearby tourist attractions?',
          isUser: true,
          timestamp: '16:45'
        },
        {
          id: 'msg2',
          content: language === 'ja' ? 'こんにちは。当ホテル周辺の観光スポットをご案内いたします。徒歩10分圏内に美術館と公園がございます。' : 'Hello. I will guide you to tourist spots around our hotel. There is a museum and park within a 10-minute walk.',
          isUser: false,
          timestamp: '16:46'
        },
        {
          id: 'msg3',
          content: language === 'ja' ? '美術館の営業時間は？' : 'What are the museum\'s opening hours?',
          isUser: true,
          timestamp: '16:47'
        },
        {
          id: 'msg4',
          content: language === 'ja' ? '美術館は9:00から17:00まで開館しており、月曜日が休館日です。入館料は大人500円です。' : 'The museum is open from 9:00 AM to 5:00 PM and is closed on Mondays. Admission is 500 yen for adults.',
          isUser: false,
          timestamp: '16:48'
        }
      ]
    };

    return sampleChats[entryId] || [];
  };

  const handleEntryClick = (entryId: string) => {
    setSelectedEntry(entryId);
    const messages = getChatHistory(entryId);
    setChatMessages(messages || []);
  };

  const handleBackToList = () => {
    setSelectedEntry(null);
    setChatMessages([]);
  };

  const onSubmitComment = (data: CommentForm) => {
    if (!data.comment.trim()) return;

    const newComment = {
      id: `hotel-comment-${Date.now()}`,
      content: data.comment,
      isUser: false,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      isHotelComment: true
    };

    setChatMessages(prev => [...prev, newComment]);
  };

  const handleMarkComplete = () => {
    if (selectedEntry) {
      setCompletedEntries(prev => {
        const newSet = new Set(prev);
        const isCompleted = newSet.has(selectedEntry);
        if (isCompleted) {
          newSet.delete(selectedEntry);
        } else {
          newSet.add(selectedEntry);
        }
        
        // 親コンポーネントに変更を通知
        const inquiryId = parseInt(selectedEntry.replace('support-', ''));
        onStatusChange?.(inquiryId.toString(), !isCompleted);
        
        return newSet;
      });
    }
  };

  const handleToggleEntryStatus = (entryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCompletedEntries(prev => {
      const newSet = new Set(prev);
      const isCompleted = newSet.has(entryId);
      if (isCompleted) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      
      // 親コンポーネントに変更を通知
      const inquiryId = parseInt(entryId.replace('support-', ''));
      onStatusChange?.(inquiryId.toString(), !isCompleted);
      
      return newSet;
    });
  };

  const isEntryCompleted = (entryId: string) => {
    return completedEntries.has(entryId);
  };

  const selectedEntryData = combinedHistory.find(e => e.id === selectedEntry);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {selectedEntry 
                ? (language === 'ja' ? 'チャット詳細' : 'Chat Details')
                : (language === 'ja' ? '対応履歴' : 'Support History')
              }
              {reservationId && !selectedEntry && (
                <Badge variant="outline" className="ml-2">
                  {reservationId}
                </Badge>
              )}
            </DialogTitle>
            
            {selectedEntry && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToList}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {language === 'ja' ? '戻る' : 'Back'}
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {selectedEntry ? (
            <ChatView
              entry={selectedEntryData}
              messages={chatMessages}
              isCompleted={isEntryCompleted(selectedEntry)}
              onSubmitComment={onSubmitComment}
              onMarkComplete={handleMarkComplete}
            />
          ) : (
            <SupportHistoryList
              history={combinedHistory}
              completedEntries={completedEntries}
              onEntryClick={handleEntryClick}
              onToggleEntryStatus={handleToggleEntryStatus}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportHistoryDialog;
