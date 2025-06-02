
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

const ReservationList: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const reservationsPerPage = 10;

  const filteredReservations = recentReservations.filter(reservation =>
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
    console.log('Edit reservation:', reservationId);
    // TODO: 予約編集ダイアログを開く実装
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
        />
      </div>
    </div>
  );
};

export default ReservationList;
