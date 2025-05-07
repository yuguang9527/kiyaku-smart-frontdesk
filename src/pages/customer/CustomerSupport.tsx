
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '@/components/ChatInterface';
import { useLanguage } from '@/hooks/use-language';
import { MessageSquare, Phone, ServerIcon } from 'lucide-react';
import CustomerNav from '@/components/customer/CustomerNav';
import PhoneAgent from '@/components/customer/PhoneAgent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CustomerSupport: React.FC = () => {
  const { language } = useLanguage();

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
    }
  };

  const isTwilioEnabled = true; // 実際のアプリではここはAPIで確認

  return (
    <div className="flex min-h-screen flex-col washi-bg">
      <CustomerNav />
      <main className="flex-1 py-6 px-6 md:px-8 lg:px-10">
        <div className="mb-6">
          <h1 className="text-3xl font-display text-primary">
            {translations.title[language]}
          </h1>
          <p className="text-muted-foreground mt-1">
            {translations.welcome[language]} | {new Date().toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Support */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>{translations.chatAssistant[language]}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChatInterface 
                title={language === 'ja' ? "AIサポート" : "AI Support"} 
                hotelInfo={{
                  name: 'Yotta!',
                  greeting: language === 'ja' 
                    ? 'いらっしゃいませ。ご質問があればお気軽にどうぞ。' 
                    : 'Welcome to Yotta!. How may I assist you today?'
                }}
              />
            </CardContent>
          </Card>

          {/* Phone Support with Agent */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>{translations.phoneSupport[language]}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-1 space-y-4">
                {/* 電話エージェントの追加 */}
                <PhoneAgent agentName="Yotta! US Support" phoneNumber="+14788001081" />
                
                <div className="text-center p-4">
                  <h3 className="text-xl font-semibold">
                    {language === 'ja' ? '24時間対応コールセンター' : '24-Hour Call Center'}
                  </h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    {language === 'ja' 
                      ? '専門スタッフがお電話でサポートいたします。' 
                      : 'Our specialist staff will assist you by phone.'}
                  </p>
                  <div className="text-2xl font-semibold text-primary pt-2">
                    +1 (478) 800-1081
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ja' 
                      ? '(24時間・年中無休)' 
                      : '(24 hours, 365 days)'}
                  </p>
                </div>
                
                {/* Twilio AIボイスアシスタント情報 */}
                {isTwilioEnabled && (
                  <div className="mt-6 border-t pt-4">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm text-green-800">
                      <h4 className="font-semibold flex items-center gap-2">
                        <ServerIcon className="h-4 w-4" />
                        {translations.twilioEnabled[language]}
                      </h4>
                      <p className="mt-1">
                        {translations.twilioDescription[language]}
                      </p>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/twilio">
                          {translations.twilioSetup[language]}
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CustomerSupport;
