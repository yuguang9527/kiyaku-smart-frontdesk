
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Clock, X, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface SupportHistoryDialogProps {
  reservationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface SupportHistoryItem {
  id: number;
  type: 'chat' | 'phone';
  title: string;
  timestamp: string;
  status: string;
  duration: string;
  agent: string;
  content: string;
  resolution: string;
}

const SupportHistoryDialog: React.FC<SupportHistoryDialogProps> = ({
  reservationId,
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<SupportHistoryItem | null>(null);

  // サンプルデータ - 実際の実装では reservationId に基づいてデータを取得
  const supportHistory: SupportHistoryItem[] = [
    {
      id: 1,
      type: 'chat',
      title: language === 'ja' ? 'チェックイン時間の確認' : 'Check-in time confirmation',
      timestamp: '2024-06-02 14:30',
      status: 'resolved',
      duration: '5分',
      agent: language === 'ja' ? '田中スタッフ' : 'Staff Tanaka',
      content: language === 'ja' 
        ? 'お客様よりチェックイン時間について問い合わせがありました。通常は15:00からですが、お部屋の準備ができ次第、早めのチェックインも可能とお伝えしました。'
        : 'Guest inquired about check-in time. Standard time is 3:00 PM, but early check-in is possible if room is ready.',
      resolution: language === 'ja'
        ? '14:30頃にお部屋の準備が完了予定で、早めのチェックインが可能とご案内。お客様にご満足いただけました。'
        : 'Room will be ready around 2:30 PM, early check-in confirmed. Guest was satisfied with the service.'
    },
    {
      id: 2,
      type: 'phone',
      title: language === 'ja' ? '部屋の設備について' : 'Room facilities inquiry',
      timestamp: '2024-06-01 16:45',
      status: 'resolved',
      duration: '8分',
      agent: language === 'ja' ? '佐藤スタッフ' : 'Staff Sato',
      content: language === 'ja'
        ? 'お客様より和室の設備について詳しい質問がありました。畳の部屋、布団、座卓、お茶セット、浴衣のご用意があることをご説明しました。'
        : 'Guest asked detailed questions about Japanese room facilities. Explained about tatami room, futon, low table, tea set, and yukata availability.',
      resolution: language === 'ja'
        ? '和室の魅力について詳しくご説明し、お客様に日本の伝統的な宿泊体験を楽しみにしていただけるようになりました。'
        : 'Explained the charm of Japanese rooms in detail. Guest is now looking forward to the traditional Japanese accommodation experience.'
    },
    {
      id: 3,
      type: 'chat',
      title: language === 'ja' ? '朝食オプションの追加' : 'Adding breakfast option',
      timestamp: '2024-05-31 10:20',
      status: 'resolved',
      duration: '3分',
      agent: language === 'ja' ? '山田スタッフ' : 'Staff Yamada',
      content: language === 'ja'
        ? 'チェックイン後に朝食オプションの追加をご希望されました。和食または洋食をお選びいただけることをご案内し、和食をご選択いただきました。'
        : 'Guest requested to add breakfast option after check-in. Offered choice between Japanese or Western breakfast, guest chose Japanese.',
      resolution: language === 'ja'
        ? '朝食オプション（和食）を予約に追加。お支払いはチェックアウト時に精算することをご案内しました。'
        : 'Added Japanese breakfast option to reservation. Payment will be settled at check-out as explained to guest.'
    }
  ];

  const getTypeIcon = (type: string) => {
    return type === 'phone' ? (
      <Phone className="h-4 w-4" />
    ) : (
      <MessageSquare className="h-4 w-4" />
    );
  };

  const getTypeBadge = (type: string) => {
    const color = type === 'phone' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
    const label = type === 'phone' 
      ? (language === 'ja' ? '電話' : 'Phone')
      : (language === 'ja' ? 'チャット' : 'Chat');
    
    return <Badge className={color}>{label}</Badge>;
  };

  const handleViewDetails = (item: SupportHistoryItem) => {
    setSelectedItem(item);
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <AlertDialog open={isOpen && !selectedItem} onOpenChange={() => onClose()}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <AlertDialogTitle>
                {language === 'ja' ? '対応履歴' : 'Support History'}
              </AlertDialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AlertDialogDescription>
              {language === 'ja' 
                ? `予約ID: ${reservationId || ''} の対応履歴`
                : `Support history for reservation: ${reservationId || ''}`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 mt-4">
            {supportHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {language === 'ja' ? '対応履歴がありません' : 'No support history found'}
              </div>
            ) : (
              supportHistory.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <h3 className="font-medium">{item.title}</h3>
                    </div>
                    {getTypeBadge(item.type)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.timestamp}
                    </div>
                    <div>
                      {language === 'ja' ? '対応時間:' : 'Duration:'} {item.duration}
                    </div>
                    <div>
                      {language === 'ja' ? '担当:' : 'Agent:'} {item.agent}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge className="bg-green-100 text-green-800">
                      {language === 'ja' ? '解決済み' : 'Resolved'}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item)}>
                      {language === 'ja' ? '詳細を見る' : 'View Details'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleBackToList}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="flex items-center gap-2">
                {selectedItem && getTypeIcon(selectedItem.type)}
                {selectedItem?.title}
              </DialogTitle>
            </div>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedItem.timestamp}
                </div>
                <div>
                  {language === 'ja' ? '対応時間:' : 'Duration:'} {selectedItem.duration}
                </div>
                <div>
                  {language === 'ja' ? '担当:' : 'Agent:'} {selectedItem.agent}
                </div>
                {getTypeBadge(selectedItem.type)}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ja' ? '対応内容' : 'Support Content'}
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm leading-relaxed">{selectedItem.content}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ja' ? '解決方法・結果' : 'Resolution & Result'}
                  </h4>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm leading-relaxed">{selectedItem.resolution}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Badge className="bg-green-100 text-green-800">
                    {language === 'ja' ? '解決済み' : 'Resolved'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportHistoryDialog;
