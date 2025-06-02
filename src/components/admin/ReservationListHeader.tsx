
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, Download, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ReservationListHeaderProps {
  totalCount: number;
  onExport: () => void;
  selectedStatus: string;
  onStatusFilter: (status: string) => void;
}

const ReservationListHeader: React.FC<ReservationListHeaderProps> = ({
  totalCount,
  onExport,
  selectedStatus,
  onStatusFilter
}) => {
  const { language } = useLanguage();

  const statusOptions = [
    { value: 'all', label: language === 'ja' ? '全て' : 'All' },
    { value: 'confirmed', label: language === 'ja' ? '確認済み' : 'Confirmed' },
    { value: 'pending', label: language === 'ja' ? '保留中' : 'Pending' },
    { value: 'cancelled', label: language === 'ja' ? 'キャンセル' : 'Cancelled' },
    { value: 'checkedIn', label: language === 'ja' ? 'チェックイン済' : 'Checked In' },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-semibold leading-none tracking-tight">
          {language === 'ja' ? '予約一覧' : 'Reservations'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === 'ja' 
            ? `全${totalCount}件の予約` 
            : `${totalCount} total reservations`}
        </p>
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {language === 'ja' ? 'フィルター' : 'Filter'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onStatusFilter(option.value)}
                className="flex items-center justify-between"
              >
                {option.label}
                {selectedStatus === option.value && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          {language === 'ja' ? '日付範囲' : 'Date Range'}
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          {language === 'ja' ? 'エクスポート' : 'Export'}
        </Button>
      </div>
    </div>
  );
};

export default ReservationListHeader;
