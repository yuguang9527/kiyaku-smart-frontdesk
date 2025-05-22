
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import ChatInterface from '@/components/chat';
import { useLanguage } from '@/hooks/use-language';
import HotelInfoDisplay, { HotelInfo } from './HotelInfoDisplay';

interface ChatSupportContentProps {
  hotelInfo: HotelInfo;
}

const ChatSupportContent: React.FC<ChatSupportContentProps> = ({
  hotelInfo
}) => {
  const { language } = useLanguage();

  const translations = {
    chatAssistant: {
      ja: 'AIチャットサポート',
      en: 'AI Chat Support'
    }
  };

  // Helper function to get localized address
  const getLocalizedAddress = () => {
    return language === 'ja' ? hotelInfo.addressJa : hotelInfo.addressEn;
  };

  return (
    <Card className="shadow-md border-slate-200">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <span>{translations.chatAssistant[language]}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <HotelInfoDisplay 
            hotelInfo={hotelInfo} 
            className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200"
          />
          
          <ChatInterface 
            hotelInfo={{
              name: hotelInfo.name,
              greeting: language === 'ja' 
                ? 'いらっしゃいませ。ご質問があればお気軽にどうぞ。' 
                : 'Welcome to ' + hotelInfo.name + '. How may I assist you today?'
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSupportContent;
