import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Clock, User, ChevronRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { ReservationUpdateHistory } from '@/types/reservation';
import { Button } from '@/components/ui/button';
import ChatBubble from '@/components/ChatBubble';

interface SupportHistoryDialogProps {
  reservationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  updateHistory?: ReservationUpdateHistory[];
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface SupportEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  details: string;
  chatMessages?: ChatMessage[];
}

const SupportHistoryDialog: React.FC<SupportHistoryDialogProps> = ({
  reservationId,
  isOpen,
  onClose,
  updateHistory = []
}) => {
  const { language } = useLanguage();
  const [selectedEntry, setSelectedEntry] = useState<SupportEntry | null>(null);

  // Sample chat conversations for each support entry
  const sampleChatMessages: Record<string, ChatMessage[]> = {
    'support-001': [
      {
        id: 'msg-001-1',
        content: language === 'ja' ? 'チェックインの時間について教えてください' : 'Could you tell me about check-in times?',
        isUser: true,
        timestamp: '14:30'
      },
      {
        id: 'msg-001-2',
        content: language === 'ja' ? 'チェックインは15:00からとなっております。お荷物のお預かりは14:00から可能です。' : 'Check-in is available from 15:00. We can store your luggage from 14:00.',
        isUser: false,
        timestamp: '14:31'
      },
      {
        id: 'msg-001-3',
        content: language === 'ja' ? '14:30頃に到着予定ですが、お部屋の準備はできていますでしょうか？' : 'I will arrive around 14:30. Will the room be ready?',
        isUser: true,
        timestamp: '14:32'
      },
      {
        id: 'msg-001-4',
        content: language === 'ja' ? 'お部屋の準備状況を確認いたします。少々お待ちください。' : 'Let me check the room preparation status. Please wait a moment.',
        isUser: false,
        timestamp: '14:33'
      },
      {
        id: 'msg-001-5',
        content: language === 'ja' ? 'お部屋の準備が完了しております。14:30にお越しいただければアーリーチェックイン可能です。' : 'Your room is ready. Early check-in is available if you arrive at 14:30.',
        isUser: false,
        timestamp: '14:35'
      }
    ],
    'support-002': [
      {
        id: 'msg-002-1',
        content: language === 'ja' ? '朝食は何時から何時まででしょうか？' : 'What are the breakfast hours?',
        isUser: true,
        timestamp: '09:15'
      },
      {
        id: 'msg-002-2',
        content: language === 'ja' ? '朝食は7:00から10:00までとなっております。場所は1階のレストランです。' : 'Breakfast is served from 7:00 to 10:00. Location is the restaurant on the 1st floor.',
        isUser: false,
        timestamp: '09:16'
      },
      {
        id: 'msg-002-3',
        content: language === 'ja' ? 'ありがとうございます。アレルギー対応はありますか？' : 'Thank you. Do you accommodate allergies?',
        isUser: true,
        timestamp: '09:17'
      },
      {
        id: 'msg-002-4',
        content: language === 'ja' ? 'はい、アレルギー対応可能です。事前にお知らせいただければ専用メニューをご用意いたします。' : 'Yes, we can accommodate allergies. Please let us know in advance and we will prepare a special menu.',
        isUser: false,
        timestamp: '09:18'
      }
    ],
    'support-003': [
      {
        id: 'msg-003-1',
        content: language === 'ja' ? '近くの観光地を教えてください' : 'Could you recommend nearby tourist attractions?',
        isUser: true,
        timestamp: '16:45'
      },
      {
        id: 'msg-003-2',
        content: language === 'ja' ? '徒歩圏内では浅草寺（5分）、スカイツリー（15分）がございます。' : 'Within walking distance, there are Sensoji Temple (5 min) and Sky Tree (15 min).',
        isUser: false,
        timestamp: '16:46'
      },
      {
        id: 'msg-003-3',
        content: language === 'ja' ? '電車でのアクセス方法も教えてください' : 'Could you also tell me how to access by train?',
        isUser: true,
        timestamp: '16:47'
      },
      {
        id: 'msg-003-4',
        content: language === 'ja' ? '最寄駅は浅草駅です。銀座線、都営浅草線、東武線が利用できます。駅からホテルまで徒歩3分です。' : 'The nearest station is Asakusa Station. You can use Ginza Line, Toei Asakusa Line, and Tobu Line. It is a 3-minute walk from the station to the hotel.',
        isUser: false,
        timestamp: '16:48'
      }
    ]
  };

  const supportHistory: SupportEntry[] = [
    {
      id: 'support-001',
      timestamp: '2025/04/20 14:30',
      agent: 'AIスタッフ',
      action: language === 'ja' ? 'チェックイン手続き案内' : 'Check-in procedure guidance',
      details: language === 'ja' ? '到着時間の確認とチェックイン手続きについて案内しました。' : 'Confirmed arrival time and provided check-in procedure guidance.',
      chatMessages: sampleChatMessages['support-001']
    },
    {
      id: 'support-002',
      timestamp: '2025/04/21 09:15',
      agent: 'AIスタッフ',
      action: language === 'ja' ? '朝食時間問い合わせ対応' : 'Breakfast time inquiry',
      details: language === 'ja' ? '朝食提供時間について回答しました。' : 'Provided information about breakfast serving hours.',
      chatMessages: sampleChatMessages['support-002']
    },
    {
      id: 'support-003',
      timestamp: '2025/04/21 16:45',
      agent: 'AIスタッフ',
      action: language === 'ja' ? '周辺観光地案内' : 'Local attractions guidance',
      details: language === 'ja' ? '近隣の観光スポットとアクセス方法を案内しました。' : 'Provided information about nearby tourist attractions and access methods.',
      chatMessages: sampleChatMessages['support-003']
    }
  ];

  // 更新履歴を含む統合履歴を作成
  const combinedHistory: SupportEntry[] = [
    ...supportHistory,
    ...updateHistory
      .filter(update => update.reservationId === reservationId)
      .map(update => ({
        id: update.id,
        timestamp: update.timestamp,
        agent: update.agent,
        action: update.action,
        details: update.changes
      }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleEntryClick = (entry: SupportEntry) => {
    if (entry.chatMessages) {
      setSelectedEntry(entry);
    }
  };

  const handleBack = () => {
    setSelectedEntry(null);
  };

  const handleClose = () => {
    setSelectedEntry(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedEntry && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mr-2 p-1 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <MessageSquare className="h-5 w-5" />
            {selectedEntry ? (
              <span>{selectedEntry.action}</span>
            ) : (
              <span>{language === 'ja' ? '対応履歴' : 'Support History'}</span>
            )}
            {reservationId && (
              <Badge variant="outline" className="ml-2">
                {reservationId}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {selectedEntry ? (
            // Chat conversation view with scrollable chat messages
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedEntry.timestamp}</span>
                  <User className="h-4 w-4 ml-4" />
                  <span>{selectedEntry.agent}</span>
                </div>
                <p className="text-sm font-medium">{selectedEntry.action}</p>
              </div>
              
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-3">
                  {selectedEntry.chatMessages?.map((message) => (
                    <ChatBubble
                      key={message.id}
                      message={message.content}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            // History list view
            <div className="space-y-4">
              {combinedHistory.length > 0 ? (
                combinedHistory.map((entry, index) => (
                  <div key={entry.id} className="space-y-2">
                    <div
                      className={`cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors ${
                        entry.chatMessages ? 'border border-blue-200' : ''
                      }`}
                      onClick={() => handleEntryClick(entry)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {entry.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{entry.agent}</span>
                          {entry.chatMessages && (
                            <ChevronRight className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-6 mt-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          {entry.action}
                          {entry.chatMessages && (
                            <Badge variant="secondary" className="text-xs">
                              {language === 'ja' ? 'チャット詳細あり' : 'Chat details available'}
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {entry.details}
                        </p>
                      </div>
                    </div>
                    
                    {index < combinedHistory.length - 1 && (
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
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SupportHistoryDialog;
