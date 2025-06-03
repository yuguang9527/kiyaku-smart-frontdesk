import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { ReservationUpdateHistory } from '@/types/reservation';
import { chatHistoryService } from '@/services/chatHistory';
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
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Support history data - same as before
  const supportHistory = [
    {
      id: 'support-001',
      timestamp: '2025/04/20 14:30',
      agent: 'AIスタッフ',
      action: language === 'ja' ? 'チェックイン手続き案内' : 'Check-in procedure guidance',
      details: language === 'ja' ? '到着時間の確認とチェックイン手続きについて案内しました。' : 'Confirmed arrival time and provided check-in procedure guidance.',
      hasChat: true,
      reservationNumber: 'RES001',
      customerName: '田中太郎'
    },
    {
      id: 'support-002',
      timestamp: '2025/04/21 09:15',
      agent: 'AIスタッフ',
      action: language === 'ja' ? '朝食時間問い合わせ対応' : 'Breakfast time inquiry',
      details: language === 'ja' ? '朝食提供時間について回答しました。' : 'Provided information about breakfast serving hours.',
      hasChat: true,
      reservationNumber: 'RES002',
      customerName: '佐藤花子'
    },
    {
      id: 'support-003',
      timestamp: '2025/04/21 16:45',
      agent: 'AIスタッフ',
      action: language === 'ja' ? '周辺観光地案内' : 'Local attractions guidance',
      details: language === 'ja' ? '近隣の観光スポットとアクセス方法を案内しました。' : 'Provided information about nearby tourist attractions and access methods.',
      hasChat: true,
      reservationNumber: 'RES003',
      customerName: 'John Smith'
    }
  ];

  // Find the selected entry based on reservationId
  const selectedEntry = supportHistory.find(entry => entry.id === reservationId);

  // Get inquiry number based on the selected entry
  const getInquiryNumber = (entryId: string) => {
    const index = supportHistory.findIndex(entry => entry.id === entryId);
    return index + 1;
  };

  const getChatHistory = (entryId: string) => {
    const entry = supportHistory.find(e => e.id === entryId);
    if (!entry || !entry.reservationNumber) return null;

    const realChatHistory = chatHistoryService.getChatHistory(entry.reservationNumber);
    if (realChatHistory) {
      return realChatHistory.messages;
    }

    // Sample chat data - same as before
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

  // Load chat messages when dialog opens or reservationId changes
  React.useEffect(() => {
    if (reservationId && isOpen) {
      const messages = getChatHistory(reservationId);
      setChatMessages(messages || []);
      // Initialize completion status based on inquiry status from parent
      setIsCompleted(false);
    }
  }, [reservationId, isOpen, language]);

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
    if (reservationId) {
      const newStatus = !isCompleted;
      setIsCompleted(newStatus);
      onStatusChange?.(reservationId, newStatus);
    }
  };

  if (!selectedEntry) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[600px] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {language === 'ja' ? 'チャット詳細' : 'Chat Details'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">
              {language === 'ja' ? 'チャット履歴が見つかりません' : 'Chat history not found'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const inquiryNumber = getInquiryNumber(selectedEntry.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="text-blue-700 font-bold">#{inquiryNumber}</span>
              <span>{selectedEntry.action}</span>
            </DialogTitle>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div>
              <span className="font-medium">
                {language === 'ja' ? '予約番号:' : 'Reservation #:'}
              </span>
              <span className="ml-1">{selectedEntry.reservationNumber}</span>
            </div>
            <div>
              <span className="font-medium">
                {language === 'ja' ? 'お客様名:' : 'Customer:'}
              </span>
              <span className="ml-1">{selectedEntry.customerName}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ChatView
            entry={selectedEntry}
            messages={chatMessages}
            isCompleted={isCompleted}
            onSubmitComment={onSubmitComment}
            onMarkComplete={handleMarkComplete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportHistoryDialog;
