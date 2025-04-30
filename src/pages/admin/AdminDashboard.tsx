
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import AdminNav from '@/components/admin/AdminNav';
import { MessageSquare, Phone, Calendar, Settings, User } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();

  const translations = {
    title: {
      ja: 'Yotta!管理ダッシュボード',
      en: 'Yotta! Admin Dashboard'
    },
    welcome: {
      ja: '管理者ページへようこそ',
      en: 'Welcome to Admin Dashboard'
    },
    stats: {
      chatRequests: {
        ja: 'チャットリクエスト',
        en: 'Chat Requests'
      },
      phoneCallsToday: {
        ja: '本日の電話',
        en: "Today's Calls"
      },
      newReservations: {
        ja: '新規予約',
        en: 'New Reservations'
      },
      activeUsers: {
        ja: 'アクティブユーザー',
        en: 'Active Users'
      }
    },
  };

  // Sample statistics for the admin dashboard
  const stats = [
    { 
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />, 
      value: 24, 
      label: translations.stats.chatRequests[language], 
      trend: "+12%"
    },
    { 
      icon: <Phone className="h-8 w-8 text-green-500" />, 
      value: 18, 
      label: translations.stats.phoneCallsToday[language], 
      trend: "-3%"
    },
    { 
      icon: <Calendar className="h-8 w-8 text-purple-500" />, 
      value: 7, 
      label: translations.stats.newReservations[language], 
      trend: "+5%"
    },
    { 
      icon: <User className="h-8 w-8 text-amber-500" />, 
      value: 156, 
      label: translations.stats.activeUsers[language], 
      trend: "+8%"
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <AdminNav />
      <main className="flex-1 py-6 px-6 md:px-8 lg:px-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="bg-background p-3 rounded-lg">
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                    stat.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ja' ? '最近のサポート問い合わせ' : 'Recent Support Inquiries'}</CardTitle>
              <CardDescription>
                {language === 'ja' ? '過去24時間の問い合わせ' : 'Inquiries from the past 24 hours'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample data - in a real app this would come from your backend */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">
                        {language === 'ja' ? `予約確認の問い合わせ #${i}` : `Reservation Confirmation #${i}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ja' ? '2時間前' : '2 hours ago'}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      i === 1 ? 'bg-green-100 text-green-800' : 
                      i === 2 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {i === 1 ? (language === 'ja' ? '完了' : 'Resolved') : 
                       i === 2 ? (language === 'ja' ? '対応中' : 'In Progress') : 
                       (language === 'ja' ? '新規' : 'New')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'ja' ? 'システム状態' : 'System Status'}</CardTitle>
              <CardDescription>
                {language === 'ja' ? 'すべてのシステムが正常に動作しています' : 'All systems operational'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Chat AI', 'Phone System', 'Booking System', 'Payment Gateway'].map((system, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <p>{system}</p>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-green-600">
                        {language === 'ja' ? '正常' : 'Operational'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
