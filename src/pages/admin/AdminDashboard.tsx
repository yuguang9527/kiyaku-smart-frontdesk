
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import AdminNav from '@/components/admin/AdminNav';
import { MessageSquare, Phone, Calendar, Settings, User, ArrowUp, ArrowDown, BarChart3, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      icon: <MessageSquare className="h-8 w-8 text-white" />, 
      value: 24, 
      label: translations.stats.chatRequests[language], 
      trend: "+12%",
      positive: true
    },
    { 
      icon: <Phone className="h-8 w-8 text-white" />, 
      value: 18, 
      label: translations.stats.phoneCallsToday[language], 
      trend: "-3%",
      positive: false
    },
    { 
      icon: <Calendar className="h-8 w-8 text-white" />, 
      value: 7, 
      label: translations.stats.newReservations[language], 
      trend: "+5%",
      positive: true
    },
    { 
      icon: <User className="h-8 w-8 text-white" />, 
      value: 156, 
      label: translations.stats.activeUsers[language], 
      trend: "+8%",
      positive: true
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-white">
      <AdminNav />
      <main className="flex-1 py-6 px-6 md:px-8 lg:px-10">
        <div className="mb-8 border-b border-blue-100 pb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-blue-800">
              {translations.title[language]}
            </h1>
          </div>
          <p className="text-blue-600 font-medium mt-1">
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
            <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300" 
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                  }}>
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
                <div className="flex justify-between items-center">
                  <div className="bg-blue-700/50 p-3 rounded-lg backdrop-blur-sm">
                    {stat.icon}
                  </div>
                  <Badge className={`${stat.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} font-medium`}>
                    {stat.trend}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 bg-white">
                <h3 className="text-3xl font-bold text-blue-900">{stat.value}</h3>
                <p className="text-sm font-medium text-blue-600 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <CardTitle>{language === 'ja' ? '最近のサポート問い合わせ' : 'Recent Support Inquiries'}</CardTitle>
              <CardDescription className="text-blue-100">
                {language === 'ja' ? '過去24時間の問い合わせ' : 'Inquiries from the past 24 hours'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-blue-100">
                {/* Sample data - in a real app this would come from your backend */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-blue-900">
                          {language === 'ja' ? `予約確認の問い合わせ #${i}` : `Reservation Confirmation #${i}`}
                        </p>
                        <p className="text-sm text-blue-600">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <CardTitle>{language === 'ja' ? 'システム状態' : 'System Status'}</CardTitle>
              <CardDescription className="text-blue-100">
                {language === 'ja' ? 'すべてのシステムが正常に動作しています' : 'All systems operational'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-blue-100">
                {['Chat AI', 'Phone System', 'Booking System', 'Payment Gateway'].map((system, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-blue-50 transition-colors">
                    <p className="font-medium text-blue-800">{system}</p>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm font-medium text-green-600">
                        {language === 'ja' ? '正常' : 'Operational'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-blue-400">
          <p>&copy; 2025 Yotta! {language === 'ja' ? '管理システム' : 'Admin System'}</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
