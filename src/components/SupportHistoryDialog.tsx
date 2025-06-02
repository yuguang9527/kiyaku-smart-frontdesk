
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Clock, X } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface SupportHistoryDialogProps {
  reservationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const SupportHistoryDialog: React.FC<SupportHistoryDialogProps> = ({
  reservationId,
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();

  // サンプルデータ - 実際の実装では reservationId に基づいてデータを取得
  const supportHistory = [
    {
      id: 1,
      type: 'chat',
      title: language === 'ja' ? 'チェックイン時間の確認' : 'Check-in time confirmation',
      timestamp: '2024-06-02 14:30',
      status: 'resolved',
      duration: '5分',
      agent: language === 'ja' ? '田中スタッフ' : 'Staff Tanaka'
    },
    {
      id: 2,
      type: 'phone',
      title: language === 'ja' ? '部屋の設備について' : 'Room facilities inquiry',
      timestamp: '2024-06-01 16:45',
      status: 'resolved',
      duration: '8分',
      agent: language === 'ja' ? '佐藤スタッフ' : 'Staff Sato'
    },
    {
      id: 3,
      type: 'chat',
      title: language === 'ja' ? '朝食オプションの追加' : 'Adding breakfast option',
      timestamp: '2024-05-31 10:20',
      status: 'resolved',
      duration: '3分',
      agent: language === 'ja' ? '山田スタッフ' : 'Staff Yamada'
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

  return (
    <AlertDialog open={isOpen} onOpenChange={() => onClose()}>
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
                  <Button variant="ghost" size="sm">
                    {language === 'ja' ? '詳細を見る' : 'View Details'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SupportHistoryDialog;
