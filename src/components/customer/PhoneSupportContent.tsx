
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import PhoneAgent from './PhoneAgent';
import { HotelInfo } from './HotelInfoDisplay';

interface PhoneSupportContentProps {
  hotelInfo: HotelInfo;
  isTwilioEnabled: boolean;
}

const PhoneSupportContent: React.FC<PhoneSupportContentProps> = ({
  hotelInfo,
  isTwilioEnabled
}) => {
  const { language } = useLanguage();

  // Helper function to get localized address
  const getLocalizedAddress = () => {
    return language === 'ja' ? hotelInfo.addressJa : hotelInfo.addressEn;
  };

  const translations = {
    phoneSupport: {
      ja: '電話サポート',
      en: 'Phone Support'
    }
  };

  return (
    <Card className="shadow-md border-slate-200">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Phone className="h-5 w-5 text-blue-500" />
          <span>{translations.phoneSupport[language]}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <PhoneAgent 
            agentName={hotelInfo.name} 
            phoneNumber={hotelInfo.phoneNumber}
            hotelAddress={getLocalizedAddress()} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneSupportContent;
