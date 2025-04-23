
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, AlertCircle } from "lucide-react";

export interface ReservationProps {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checkedIn';
  roomType: string;
  source?: string;
  notes?: string;
}

const statusConfig = {
  confirmed: { label: '確認済み', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  pending: { label: '保留中', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  cancelled: { label: 'キャンセル', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  checkedIn: { label: 'チェックイン済', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
};

const ReservationCard: React.FC<ReservationProps> = ({
  guestName,
  checkIn,
  checkOut,
  guests,
  status,
  roomType,
  source,
  notes
}) => {
  const { label, color } = statusConfig[status];

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">{guestName}</CardTitle>
          <p className="text-sm text-muted-foreground">{roomType}</p>
        </div>
        <Badge className={color}>{label}</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-2">
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
          {source && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 opacity-70" />
              <span className="text-sm">{source}</span>
            </div>
          )}
        </div>
        
        {notes && (
          <div className="flex gap-2 mt-2 p-2 bg-muted rounded text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{notes}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
