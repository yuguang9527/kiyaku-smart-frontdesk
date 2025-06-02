
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, MessageSquare, Edit } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { ReservationProps } from '@/components/ReservationCard';

interface ReservationTableProps {
  reservations: ReservationProps[];
  onViewHistory: (reservationId: string) => void;
  onEditReservation?: (reservationId: string) => void;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
  reservations,
  onViewHistory,
  onEditReservation
}) => {
  const { language } = useLanguage();

  const statusConfig = {
    confirmed: { label: language === 'ja' ? '確認済み' : 'Confirmed', color: 'bg-green-100 text-green-800' },
    pending: { label: language === 'ja' ? '保留中' : 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: language === 'ja' ? 'キャンセル' : 'Cancelled', color: 'bg-red-100 text-red-800' },
    checkedIn: { label: language === 'ja' ? 'チェックイン済' : 'Checked In', color: 'bg-blue-100 text-blue-800' },
  };

  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === 'ja' ? '予約番号' : 'Reservation No.'}</TableHead>
            <TableHead>{language === 'ja' ? 'ゲスト名' : 'Guest Name'}</TableHead>
            <TableHead>{language === 'ja' ? 'チェックイン / チェックアウト' : 'Check In / Check Out'}</TableHead>
            <TableHead>{language === 'ja' ? '人数' : 'Guests'}</TableHead>
            <TableHead>{language === 'ja' ? '部屋タイプ' : 'Room Type'}</TableHead>
            <TableHead>{language === 'ja' ? 'ステータス' : 'Status'}</TableHead>
            <TableHead>{language === 'ja' ? '対応履歴' : 'Support History'}</TableHead>
            <TableHead>{language === 'ja' ? '編集' : 'Edit'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-mono text-sm">{reservation.reservationNumber}</TableCell>
              <TableCell className="font-medium">{reservation.guestName}</TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1">
                  <div className="text-sm">
                    <span className="text-muted-foreground text-xs">
                      {language === 'ja' ? 'チェックイン' : 'Check In'}
                    </span>
                    <div>{reservation.checkIn}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground text-xs">
                      {language === 'ja' ? 'チェックアウト' : 'Check Out'}
                    </span>
                    <div>{reservation.checkOut}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {reservation.guests}
                </div>
              </TableCell>
              <TableCell>{reservation.roomType}</TableCell>
              <TableCell>
                <Badge className={statusConfig[reservation.status].color}>
                  {statusConfig[reservation.status].label}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewHistory(reservation.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {language === 'ja' ? '履歴' : 'History'}
                </Button>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEditReservation?.(reservation.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReservationTable;
