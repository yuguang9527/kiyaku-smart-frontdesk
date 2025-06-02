
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Filter, Calendar, Users, Eye, Edit, Download, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { recentReservations } from '@/data/reservations';
import { exportReservationsToCSV } from '@/utils/exportReservations';
import ReservationCard from '@/components/ReservationCard';
import SupportHistoryDialog from '@/components/SupportHistoryDialog';

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

  const statusConfig = {
    confirmed: { label: language === 'ja' ? '確認済み' : 'Confirmed', color: 'bg-green-100 text-green-800' },
    pending: { label: language === 'ja' ? '保留中' : 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: language === 'ja' ? 'キャンセル' : 'Cancelled', color: 'bg-red-100 text-red-800' },
    checkedIn: { label: language === 'ja' ? 'チェックイン済' : 'Checked In', color: 'bg-blue-100 text-blue-800' },
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
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>{language === 'ja' ? '予約一覧' : 'Reservations'}</CardTitle>
                <CardDescription>
                  {language === 'ja' 
                    ? `全${filteredReservations.length}件の予約` 
                    : `${filteredReservations.length} total reservations`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {language === 'ja' ? 'フィルター' : 'Filter'}
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {language === 'ja' ? '日付範囲' : 'Date Range'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'ja' ? 'エクスポート' : 'Export'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={language === 'ja' ? 'ゲスト名や部屋タイプで検索...' : 'Search by guest name or room type...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'ja' ? 'ゲスト名' : 'Guest Name'}</TableHead>
                    <TableHead>{language === 'ja' ? 'チェックイン' : 'Check In'}</TableHead>
                    <TableHead>{language === 'ja' ? 'チェックアウト' : 'Check Out'}</TableHead>
                    <TableHead>{language === 'ja' ? '人数' : 'Guests'}</TableHead>
                    <TableHead>{language === 'ja' ? '部屋タイプ' : 'Room Type'}</TableHead>
                    <TableHead>{language === 'ja' ? 'ステータス' : 'Status'}</TableHead>
                    <TableHead>{language === 'ja' ? '対応履歴' : 'Support History'}</TableHead>
                    <TableHead>{language === 'ja' ? '操作' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.guestName}</TableCell>
                      <TableCell>{reservation.checkIn}</TableCell>
                      <TableCell>{reservation.checkOut}</TableCell>
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
                          onClick={() => handleViewHistory(reservation.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {language === 'ja' ? '履歴' : 'History'}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === index + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(index + 1);
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
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
