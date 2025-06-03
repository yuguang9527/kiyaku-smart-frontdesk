
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Clock, User, ChevronRight, ArrowLeft, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { ReservationUpdateHistory } from '@/types/reservation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import ChatBubble from '@/components/ChatBubble';
import { chatHistoryService } from '@/services/chatHistory';

interface SupportHistoryDialogProps {
  reservationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  updateHistory?: ReservationUpdateHistory[];
}

interface CommentForm {
  comment: string;
}

const SupportHistoryDialog: React.FC<SupportHistoryDialogProps> = ({
  reservationId,
  isOpen,
  onClose,
  updateHistory = []
}) => {
  const { language } = useLanguage();
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const form = useForm<CommentForm>({
    defaultValues: {
      comment: ''
    }
  });

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

  // 更新履歴を含む統合履歴を作成
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

  // サンプルチャットデータの取得
  const getChatHistory = (entryId: string) => {
    const entry = supportHistory.find(e => e.id === entryId);
    if (!entry || !entry.reservationNumber) return null;

    // 実際のチャット履歴を取得を試みる
    const realChatHistory = chatHistoryService.getChatHistory(entry.reservationNumber);
    if (realChatHistory) {
      return realChatHistory.messages;
    }

    // サンプルデータ
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
    form.reset();
  };

  const handleBackToList = () => {
    setSelectedEntry(null);
    setChatMessages([]);
    form.reset();
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
    form.reset();
  };

  const renderChatView = () => {
    if (!selectedEntry) return null;

    const entry = combinedHistory.find(e => e.id === selectedEntry);

    if (!chatMessages || chatMessages.length === 0) {
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
            <h4 className="font-medium">{entry?.action}</h4>
            <p className="text-sm text-muted-foreground">{entry?.timestamp}</p>
          </div>
        </div>
        
        <ScrollArea className="flex-1 h-[200px]">
          <div className="space-y-4 pr-4">
            {chatMessages.map((message: any) => (
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitComment)} className="space-y-3">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {language === 'ja' ? 'ホテルスタッフコメント' : 'Hotel Staff Comment'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={language === 'ja' ? 'コメントを入力してください...' : 'Enter your comment...'}
                      className="min-h-[60px] resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                {language === 'ja' ? 'コメント追加' : 'Add Comment'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  };

  const renderHistoryList = () => (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {combinedHistory.length > 0 ? (
          combinedHistory.map((entry, index) => (
            <div key={entry.id} className="space-y-2">
              <div 
                className={`cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors ${
                  'hasChat' in entry && entry.hasChat ? '' : 'cursor-default'
                }`}
                onClick={() => 'hasChat' in entry && entry.hasChat ? handleEntryClick(entry.id) : undefined}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {entry.timestamp}
                    </span>
                    {'hasChat' in entry && entry.hasChat && (
                      <Badge variant="secondary" className="text-xs">
                        {language === 'ja' ? 'チャット詳細あり' : 'Chat Available'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{entry.agent}</span>
                    {'hasChat' in entry && entry.hasChat && (
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
    </ScrollArea>
  );

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
          {selectedEntry ? renderChatView() : renderHistoryList()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportHistoryDialog;
