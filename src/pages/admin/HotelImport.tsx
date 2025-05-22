
import React from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HotelInfoForm } from '@/components/admin/HotelInfoForm';
import { QAManagement } from '@/components/admin/QAManagement';

const HotelImport: React.FC = () => {
  const { language } = useLanguage();
  
  const translations = {
    title: {
      ja: 'ホテル情報',
      en: 'Hotel Information'
    },
    description: {
      ja: 'ホテル情報と質問応答のインポート・管理',
      en: 'Import and manage hotel information and Q&A'
    },
    tabs: {
      hotelInfo: {
        ja: 'ホテル基本情報',
        en: 'Hotel Info'
      },
      qa: {
        ja: '質問と回答',
        en: 'Q&A'
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <AdminNav />
      <main className="flex-1 py-6 px-6 md:px-8 lg:px-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">
            {translations.title[language]}
          </h1>
          <p className="text-muted-foreground mt-1">
            {translations.description[language]}
          </p>
        </div>

        <Tabs defaultValue="hotelInfo" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="hotelInfo">
              {translations.tabs.hotelInfo[language]}
            </TabsTrigger>
            <TabsTrigger value="qa">
              {translations.tabs.qa[language]}
            </TabsTrigger>
          </TabsList>

          {/* Hotel Information Tab */}
          <TabsContent value="hotelInfo">
            <Card>
              <CardHeader>
                <CardTitle>{translations.tabs.hotelInfo[language]}</CardTitle>
                <CardDescription>
                  {language === 'ja' 
                    ? 'ホテルの基本情報を入力してください' 
                    : 'Enter basic information about your hotel'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HotelInfoForm language={language} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Q&A Tab */}
          <TabsContent value="qa">
            <QAManagement language={language} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HotelImport;
