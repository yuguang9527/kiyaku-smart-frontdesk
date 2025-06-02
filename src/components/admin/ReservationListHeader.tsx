
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, Download, Check, CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface ReservationListHeaderProps {
  totalCount: number;
  onExport: () => void;
  selectedStatus: string;
  onStatusFilter: (status: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const ReservationListHeader: React.FC<ReservationListHeaderProps> = ({
  totalCount,
  onExport,
  selectedStatus,
  onStatusFilter,
  dateRange,
  onDateRangeChange
}) => {
  const { language } = useLanguage();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: language === 'ja' ? '全て' : 'All' },
    { value: 'confirmed', label: language === 'ja' ? '確認済み' : 'Confirmed' },
    { value: 'pending', label: language === 'ja' ? '保留中' : 'Pending' },
    { value: 'cancelled', label: language === 'ja' ? 'キャンセル' : 'Cancelled' },
    { value: 'checkedIn', label: language === 'ja' ? 'チェックイン済' : 'Checked In' },
  ];

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;

    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      // Start new range
      onDateRangeChange({ from: selected, to: undefined });
    } else if (dateRange.from && !dateRange.to) {
      // Complete the range
      if (selected < dateRange.from) {
        onDateRangeChange({ from: selected, to: dateRange.from });
      } else {
        onDateRangeChange({ from: dateRange.from, to: selected });
      }
      setIsDatePickerOpen(false);
    }
  };

  const clearDateRange = () => {
    onDateRangeChange({ from: undefined, to: undefined });
    setIsDatePickerOpen(false);
  };

  const getDateRangeText = () => {
    if (!dateRange.from) {
      return language === 'ja' ? '日付を選択' : 'Pick dates';
    }
    if (!dateRange.to) {
      return format(dateRange.from, 'yyyy/MM/dd') + ' - ' + (language === 'ja' ? '終了日を選択' : 'Pick end date');
    }
    return format(dateRange.from, 'yyyy/MM/dd') + ' - ' + format(dateRange.to, 'yyyy/MM/dd');
  };

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
        
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {getDateRangeText()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3">
              <CalendarComponent
                mode="single"
                selected={dateRange.from}
                onSelect={handleDateSelect}
                className="pointer-events-auto"
              />
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={clearDateRange} variant="outline">
                  {language === 'ja' ? 'クリア' : 'Clear'}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          {language === 'ja' ? 'エクスポート' : 'Export'}
        </Button>
      </div>
    </div>
  );
};

export default ReservationListHeader;
