import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '@/components/ChatInterface';
import { useLanguage } from '@/hooks/use-language';
import { MessageSquare, Phone, ServerIcon } from 'lucide-react';
import CustomerNav from '@/components/customer/CustomerNav';
import PhoneAgent from '@/components/customer/PhoneAgent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Define a type for the hotel information
interface HotelInfo {
  name: string;
  address: string;
  phoneNumber: string;
}

const CustomerSupport: React.FC = () => {
  const { language } = useLanguage();
  // Set default to 'phone' instead of having a toggle
  const [activeTab] = useState<'chat' | 'phone'>('phone'); 
  const [hotelInfo, setHotelInfo] = useState<HotelInfo>({
    name: 'Yotta! Hotel',
    address: '123 Sky Tower, Shinjuku, Tokyo, Japan',
    phoneNumber: '+14788001081'
  });

  // Effect to load hotel information from localStorage (where HotelImport would save it)
  useEffect(() => {
    try {
      const savedHotelInfo = localStorage.getItem('hotelInfo');
      if (savedHotelInfo) {
        const parsedInfo = JSON.parse(savedHotelInfo);
        setHotelInfo(prevInfo => ({
          ...prevInfo,
          name: parsedInfo.name || prevInfo.name,
          address: parsedInfo.address || prevInfo.address,
          // Only update phone if available, otherwise keep the default
          phoneNumber: parsedInfo.phoneNumber || prevInfo.phoneNumber
        }));
      }
    } catch (error) {
      console.error('Failed to load hotel info from localStorage:', error);
    }
  }, []);

  const translations = {
    title: {
      ja: 'Yotta!カスタマーサポート',
      en: 'Yotta! Customer Support'
    },
    welcome: {
      ja: 'ようこそ',
      en: 'Welcome'
    },
    chatAssistant: {
      ja: 'AIチャットサポート',
      en: 'AI Chat Support'
    },
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
    },
    selectSupport: {
      ja: 'サポート方法を選択',
      en: 'Select Support Method'
    }
  };

  const isTwilioEnabled = true; // 実際のアプリではここはAPIで確認

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <CustomerNav />
      <main className="flex-1 py-8 px-6 md:px-10 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold tracking-tight">
            {translations.title[language]}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            {translations.welcome[language]} | {new Date().toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Hero Section - Removed buttons */}
        <div className="mb-10">
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-medium text-blue-900">
                {language === 'ja' ? '24時間365日サポート' : '24/7 Support Available'}
              </h2>
              <p className="text-blue-700 md:text-lg max-w-md">
                {language === 'ja' 
                  ? 'AIスタッフがいつでもサポートいたします。' 
                  : 'Our cutting-edge support system powered by AI is always ready to assist you.'}
              </p>
              {/* Removed the chat/phone buttons */}
            </div>
          </div>
        </div>

        {/* Removed the Support Tabs section */}

        {/* Content Area - Only showing phone support */}
        <div className="grid grid-cols-1 gap-6 animate-fadeIn">
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Phone className="h-5 w-5 text-blue-500" />
                <span>{translations.phoneSupport[language]}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* 電話エージェントの追加 - Pass hotel information */}
                <PhoneAgent 
                  agentName={hotelInfo.name} 
                  phoneNumber={hotelInfo.phoneNumber}
                  hotelAddress={hotelInfo.address} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Twilio AIボイスアシスタント情報 - Kept at bottom */}
        {isTwilioEnabled && (
          <div className="mt-6">
            <div className="rounded-xl border border-emerald-100 overflow-hidden">
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
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerSupport;
