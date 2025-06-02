
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { recentReservations } from '@/data/reservations';
import { exportReservationsToCSV } from '@/utils/exportReservations';
import ReservationCard from '@/components/ReservationCard';
import SupportHistoryDialog from '@/components/SupportHistoryDialog';
import ReservationListHeader from '@/components/admin/ReservationListHeader';
import ReservationSearchBar from '@/components/admin/ReservationSearchBar';
import ReservationTable from '@/components/admin/ReservationTable';
import ReservationPagination from '@/components/admin/ReservationPagination';
import { EditReservationDialog, EditReservationFormValues } from '@/components/admin/EditReservationDialog';
import { ReservationProps } from '@/components/ReservationCard';
import { ReservationUpdateHistory } from '@/types/reservation';
import { useToast } from '@/hooks/use-toast';

const ReservationList: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [reservations, setReservations] = useState(recentReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [editingReservation, setEditingReservation] = useState<ReservationProps | null>(null);
  const [updateHistory, setUpdateHistory] = useState<ReservationUpdateHistory[]>([]);
  const reservationsPerPage = 10;

  const filteredReservations = reservations.filter(reservation =>
    reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.roomType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);
  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

  const handleExport = () => {
    try {
      exportReservationsToCSV(filteredReservations, language);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleViewHistory = (reservationId: string) => {
    setSelectedReservationId(reservationId);
  };

  const handleEditReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      setEditingReservation(reservation);
    }
  };

  const generateChangeDescription = (original: ReservationProps, updated: EditReservationFormValues, language: 'ja' | 'en'): string => {
    const changes: string[] = [];
    
    if (original.guestName !== updated.guestName) {
      changes.push(language === 'ja' 
        ? `ゲスト名: ${original.guestName} → ${updated.guestName}`
        : `Guest Name: ${original.guestName} → ${updated.guestName}`);
    }
    if (original.checkIn !== updated.checkIn) {
      changes.push(language === 'ja' 
        ? `チェックイン: ${original.checkIn} → ${updated.checkIn}`
        : `Check In: ${original.checkIn} → ${updated.checkIn}`);
    }
    if (original.checkOut !== updated.checkOut) {
      changes.push(language === 'ja' 
        ? `チェックアウト: ${original.checkOut} → ${updated.checkOut}`
        : `Check Out: ${original.checkOut} → ${updated.checkOut}`);
    }
    if (original.guests !== updated.guests) {
      changes.push(language === 'ja' 
        ? `人数: ${original.guests} → ${updated.guests}`
        : `Guests: ${original.guests} → ${updated.guests}`);
    }
    if (original.roomType !== updated.roomType) {
      changes.push(language === 'ja' 
        ? `部屋タイプ: ${original.roomType} → ${updated.roomType}`
        : `Room Type: ${original.roomType} → ${updated.roomType}`);
    }
    if (original.status !== updated.status) {
      const statusLabels = {
        confirmed: language === 'ja' ? '確認済み' : 'Confirmed',
        pending: language === 'ja' ? '保留中' : 'Pending',
        cancelled: language === 'ja' ? 'キャンセル' : 'Cancelled',
        checkedIn: language === 'ja' ? 'チェックイン済' : 'Checked In',
      };
      changes.push(language === 'ja' 
        ? `ステータス: ${statusLabels[original.status]} → ${statusLabels[updated.status]}`
        : `Status: ${statusLabels[original.status]} → ${statusLabels[updated.status]}`);
    }
    if ((original.notes || '') !== (updated.notes || '')) {
      changes.push(language === 'ja' 
        ? `備考: ${original.notes || '(なし)'} → ${updated.notes || '(なし)'}`
        : `Notes: ${original.notes || '(none)'} → ${updated.notes || '(none)'}`);
    }

    return changes.join(', ');
  };

  const handleSaveReservation = (data: EditReservationFormValues, originalData: ReservationProps) => {
    const changeDescription = generateChangeDescription(originalData, data, language);
    
    if (changeDescription) {
      // 予約データを更新
      setReservations(prev => prev.map(reservation => 
        reservation.id === originalData.id 
          ? { ...reservation, ...data }
          : reservation
      ));

      // 更新履歴を追加
      const newHistoryEntry: ReservationUpdateHistory = {
        id: `update-${Date.now()}`,
        reservationId: originalData.id,
        timestamp: new Date().toLocaleString('ja-JP'),
        agent: 'AIスタッフ',
        action: language === 'ja' ? '予約情報更新' : 'Reservation Updated',
        changes: changeDescription
      };
      
      setUpdateHistory(prev => [...prev, newHistoryEntry]);

      toast({
        title: language === 'ja' ? '予約が更新されました' : 'Reservation Updated',
        description: language === 'ja' ? '予約情報が正常に更新されました。' : 'Reservation details have been successfully updated.',
      });
    } else {
      toast({
        title: language === 'ja' ? '変更なし' : 'No Changes',
        description: language === 'ja' ? '変更された項目がありません。' : 'No changes were made to the reservation.',
      });
    }

    setEditingReservation(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {language === 'ja' ? '予約管理' : 'Reservation Management'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {language === 'ja' ? 'サイトからの予約を管理・確認できます' : 'Manage and view website reservations'}
          </p>
        </div>

        <Card>
          <div className="flex flex-col space-y-1.5 p-6">
            <ReservationListHeader
              totalCount={filteredReservations.length}
              onExport={handleExport}
            />
          </div>
          <CardContent>
            <div className="mb-6">
              <ReservationSearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            <ReservationTable
              reservations={currentReservations}
              onViewHistory={handleViewHistory}
              onEditReservation={handleEditReservation}
            />

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {currentReservations.map((reservation) => (
                <ReservationCard 
                  key={reservation.id} 
                  {...reservation}
                  onViewHistory={() => handleViewHistory(reservation.id)}
                />
              ))}
            </div>

            <ReservationPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>

        <SupportHistoryDialog 
          reservationId={selectedReservationId}
          isOpen={!!selectedReservationId}
          onClose={() => setSelectedReservationId(null)}
          updateHistory={updateHistory}
        />

        <EditReservationDialog
          isOpen={!!editingReservation}
          onOpenChange={(open) => !open && setEditingReservation(null)}
          onSave={handleSaveReservation}
          reservation={editingReservation}
        />
      </div>
    </div>
  );
};

export default ReservationList;
