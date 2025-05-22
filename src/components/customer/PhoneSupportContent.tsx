
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, ServerIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import PhoneAgent from './PhoneAgent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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
    },
    twilioEnabled: {
      ja: 'Twilio AIボイスアシスタントが有効です',
      en: 'Twilio AI Voice Assistant is enabled'
    },
    twilioDescription: {
      ja: 'この電話番号に掛けると、AIアシスタントが自動で応答します',
      en: 'When you call this number, our AI assistant will automatically respond'
    },
    twilioSetup: {
      ja: 'Twilio設定を管理',
      en: 'Manage Twilio Settings'
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
          
          {isTwilioEnabled && (
            <div className="mt-8 rounded-xl border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 text-emerald-800">
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <ServerIcon className="h-5 w-5 text-emerald-500" />
                  {translations.twilioEnabled[language]}
                </h4>
                <p className="text-emerald-700">
                  {translations.twilioDescription[language]}
                </p>
              </div>
              
              <div className="flex justify-center p-4 bg-white">
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
                  <Link to="/admin/twilio">
                    <ServerIcon className="mr-2 h-4 w-4" />
                    {translations.twilioSetup[language]}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneSupportContent;
