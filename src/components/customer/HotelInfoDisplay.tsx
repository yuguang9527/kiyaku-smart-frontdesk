
import React from 'react';
import { useLanguage } from '@/hooks/use-language';

export interface HotelInfo {
  name?: string; // 後方互換性のため
  nameJa?: string;
  nameEn?: string;
  addressJa: string;
  addressEn: string;
  phoneNumber: string;
}

interface HotelInfoDisplayProps {
  hotelInfo: HotelInfo;
  className?: string;
}

const HotelInfoDisplay: React.FC<HotelInfoDisplayProps> = ({
  hotelInfo,
  className = "",
}) => {
  const { language } = useLanguage();

  // Get the localized hotel name based on current language
  const getLocalizedHotelName = () => {
    if (language === 'ja') {
      return hotelInfo.nameJa || hotelInfo.name || '';
    } else {
      return hotelInfo.nameEn || hotelInfo.name || '';
    }
  };

  // Get the localized address based on current language
  const getLocalizedAddress = () => {
    return language === 'ja' ? hotelInfo.addressJa : hotelInfo.addressEn;
  };

  return (
    <div className={`text-left space-y-2 ${className}`}>
      <div className="flex items-start gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {language === 'ja' ? 'ホテル名' : 'Hotel'}:
        </span>
        <span className="text-sm font-bold">{getLocalizedHotelName()}</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {language === 'ja' ? '住所' : 'Address'}:
        </span>
        <span className="text-sm font-bold">{getLocalizedAddress()}</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {language === 'ja' ? '電話番号' : 'Phone number'}:
        </span>
        <span className="text-sm font-bold">{hotelInfo.phoneNumber}</span>
      </div>
    </div>
  );
};

export default HotelInfoDisplay;
