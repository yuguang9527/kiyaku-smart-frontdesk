
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MessageSquare, AlertCircle, Hash } from "lucide-react";
import { useLanguage } from '@/hooks/use-language';

export interface ReservationProps {
  id: string;
  reservationNumber: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checkedIn';
  roomType: string;
  notes?: string;
  onViewHistory?: () => void;
}

const ReservationCard: React.FC<ReservationProps> = ({
  reservationNumber,
  guestName,
  checkIn,
  checkOut,
  guests,
  status,
  roomType,
  notes,
  onViewHistory
}) => {
  const { language } = useLanguage();

  const statusConfig = {
    confirmed: { 
      label: language === 'ja' ? '確認済み' : 'Confirmed', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
    },
    pending: { 
      label: language === 'ja' ? '保留中' : 'Pending', 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
    },
    cancelled: { 
      label: language === 'ja' ? 'キャンセル' : 'Cancelled', 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
    },
    checkedIn: { 
      label: language === 'ja' ? 'チェックイン済' : 'Checked In', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
    },
  };

  const { label, color } = statusConfig[status];

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Hash className="h-4 w-4 opacity-70" />
            <span className="text-sm text-muted-foreground">{reservationNumber}</span>
          </div>
          <CardTitle className="text-lg">{guestName}</CardTitle>
          <p className="text-sm text-muted-foreground">{roomType}</p>
        </div>
        <Badge className={color}>{label}</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 opacity-70" />
            <span className="text-sm">
              {checkIn} - {checkOut}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 opacity-70" />
            <span className="text-sm">{guests}名</span>
          </div>
        </div>
        
        {notes && (
          <div className="flex gap-2 mb-3 p-2 bg-muted rounded text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{notes}</span>
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onViewHistory}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            {language === 'ja' ? '対応履歴' : 'Support History'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
