
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, Download } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface ReservationListHeaderProps {
  totalCount: number;
  onExport: () => void;
}

const ReservationListHeader: React.FC<ReservationListHeaderProps> = ({
  totalCount,
  onExport
}) => {
  const { language } = useLanguage();

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
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          {language === 'ja' ? 'フィルター' : 'Filter'}
        </Button>
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
