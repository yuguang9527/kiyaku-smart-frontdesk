
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import CustomerNav from '@/components/customer/CustomerNav';
import CustomerSupportHero from './CustomerSupportHero';
import CustomerSupportTabs from './CustomerSupportTabs';
import ChatSupportContent from './ChatSupportContent';
import PhoneSupportContent from './PhoneSupportContent';
import { ServerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HotelInfo } from './HotelInfoDisplay';

const CustomerSupport: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'chat' | 'phone'>('chat');

  // Hotel information
  const hotelInfo: HotelInfo = {
    name: 'Yotta!',
    addressJa: '東京都新宿区スカイタワー123',
    addressEn: '123 Sky Tower, Shinjuku, Tokyo, Japan',
    phoneNumber: '+14788001081'
  };

  const translations = {
    title: {
      ja: 'Yotta!カスタマーサポート',
      en: 'Yotta! Customer Support'
    },
    welcome: {
      ja: 'ようこそ',
      en: 'Welcome'
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

  const isTwilioEnabled = true; // In a real app, this would be checked via API

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

        {/* Hero Section */}
        <CustomerSupportHero activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Support Tabs */}
        <CustomerSupportTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <div className="grid grid-cols-1 gap-6 animate-fadeIn">
          {activeTab === 'chat' ? (
            <ChatSupportContent hotelInfo={hotelInfo} />
          ) : (
            <PhoneSupportContent hotelInfo={hotelInfo} isTwilioEnabled={isTwilioEnabled} />
          )}
        </div>
        
        {/* Twilio AIボイスアシスタント情報 - Kept at bottom */}
        {activeTab === 'phone' && isTwilioEnabled && (
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
