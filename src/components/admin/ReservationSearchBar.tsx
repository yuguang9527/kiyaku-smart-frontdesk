
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface ReservationSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ReservationSearchBar: React.FC<ReservationSearchBarProps> = ({
  searchTerm,
  onSearchChange
}) => {
  const { language } = useLanguage();

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={language === 'ja' ? 'ゲスト名や部屋タイプで検索...' : 'Search by guest name or room type...'}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default ReservationSearchBar;
