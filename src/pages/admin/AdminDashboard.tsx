import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import AdminNav from '@/components/admin/AdminNav';
import { MessageSquare, Phone, Calendar, Settings, User, ArrowUp, ArrowDown, BarChart3, Activity, Check, Clock, Plane } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [activeInquiryTab, setActiveInquiryTab] = useState<'all' | 'completed' | 'incomplete'>('all');

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
    inquiries: {
      recent: {
        ja: '最近のサポート問い合わせ',
        en: 'Recent Support Inquiries'
      },
      past24h: {
        ja: '過去24時間の問い合わせ',
        en: 'Inquiries from the past 24 hours'
      },
      completed: {
        ja: '完了',
        en: 'Completed'
      },
      incomplete: {
        ja: '未完了',
        en: 'Incomplete'
      },
      all: {
        ja: 'すべて',
        en: 'All'
      },
      counts: {
        completed: {
          ja: '完了件数',
          en: 'Completed'
        },
        incomplete: {
          ja: '未完了件数',
          en: 'Incomplete'
        }
      },
      status: {
        resolved: {
          ja: '完了',
          en: 'Resolved'
        },
        inProgress: {
          ja: '対応中',
          en: 'In Progress'
        },
        new: {
          ja: '新規',
          en: 'New'
        }
      },
      time: {
        hoursAgo: {
          ja: '時間前',
          en: 'hours ago'
        }
      }
    },
    system: {
      ja: 'システム状態',
      en: 'System Status'
    },
    operational: {
      ja: 'すべてのシステムが正常に動作しています',
      en: 'All systems operational'
    }
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

  // Sample support inquiries data
  const inquiries = [
    { 
      id: 1, 
      title: language === 'ja' ? '予約確認の問い合わせ' : 'Reservation Confirmation',
      time: 2,
      status: 'resolved' 
    },
    { 
      id: 2, 
      title: language === 'ja' ? 'チェックアウト時間の変更' : 'Change in Check-out Time',
      time: 4,
      status: 'in-progress' 
    },
    { 
      id: 3, 
      title: language === 'ja' ? '部屋の設備について' : 'Room Facilities Inquiry',
      time: 6,
      status: 'new' 
    },
    { 
      id: 4, 
      title: language === 'ja' ? '朝食オプションの追加' : 'Adding Breakfast Option',
      time: 8,
      status: 'resolved' 
    },
    { 
      id: 5, 
      title: language === 'ja' ? '追加料金について' : 'Additional Charges',
      time: 10,
      status: 'in-progress' 
    }
  ];

  const completedInquiries = inquiries.filter(inq => inq.status === 'resolved');
  const incompleteInquiries = inquiries.filter(inq => inq.status !== 'resolved');

  // Helper function to get the appropriate inquiries based on active tab
  const getFilteredInquiries = () => {
    switch (activeInquiryTab) {
      case 'completed':
        return completedInquiries;
      case 'incomplete':
        return incompleteInquiries;
      default:
        return inquiries;
    }
  };

  // Helper function to get badge styling by status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Helper function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved':
        return translations.inquiries.status.resolved[language];
      case 'in-progress':
        return translations.inquiries.status.inProgress[language];
      default:
        return translations.inquiries.status.new[language];
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-300 via-blue-100 to-white relative overflow-hidden">
      {/* Decorative airplane */}
      <div className="absolute right-[5%] top-[15%] transform -rotate-12 opacity-20">
        <Plane className="h-16 w-16 text-blue-600" />
      </div>
      
      {/* Sun rays */}
      <div className="absolute left-10 top-0 w-96 h-96 bg-gradient-to-b from-amber-200 to-transparent opacity-20 rounded-full blur-xl"></div>
      
      <AdminNav />
      <main className="flex-1 py-6 px-6 md:px-8 lg:px-10 relative z-10">
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
            <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm" 
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
              <CardContent className="p-4 bg-white/90">
                <h3 className="text-3xl font-bold text-blue-900">{stat.value}</h3>
                <p className="text-sm font-medium text-blue-600 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <CardTitle>{translations.inquiries.recent[language]}</CardTitle>
              <CardDescription className="text-blue-100">
                {translations.inquiries.past24h[language]}
              </CardDescription>
            </CardHeader>
            <div className="bg-white/90 p-4 flex space-x-4 border-b border-blue-100">
              <button 
                onClick={() => setActiveInquiryTab('all')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${activeInquiryTab === 'all' ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50'}`}
              >
                <Activity className="h-5 w-5" />
                <span>{translations.inquiries.all[language]} ({inquiries.length})</span>
              </button>
              <button 
                onClick={() => setActiveInquiryTab('completed')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${activeInquiryTab === 'completed' ? 'bg-green-100 text-green-800' : 'hover:bg-blue-50'}`}
              >
                <Check className="h-5 w-5" />
                <span>{translations.inquiries.counts.completed[language]} ({completedInquiries.length})</span>
              </button>
              <button 
                onClick={() => setActiveInquiryTab('incomplete')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${activeInquiryTab === 'incomplete' ? 'bg-yellow-100 text-yellow-800' : 'hover:bg-blue-50'}`}
              >
                <Clock className="h-5 w-5" />
                <span>{translations.inquiries.counts.incomplete[language]} ({incompleteInquiries.length})</span>
              </button>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-blue-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ja' ? '問い合わせ' : 'Inquiry'}</TableHead>
                      <TableHead>{language === 'ja' ? '時間' : 'Time'}</TableHead>
                      <TableHead>{language === 'ja' ? 'ステータス' : 'Status'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredInquiries().map(inquiry => (
                      <TableRow key={inquiry.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="font-medium text-blue-900">{inquiry.title} #{inquiry.id}</TableCell>
                        <TableCell className="text-sm text-blue-600">{inquiry.time} {translations.inquiries.time.hoursAgo[language]}</TableCell>
                        <TableCell>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getStatusBadgeClass(inquiry.status)}`}>
                            {getStatusText(inquiry.status)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <CardTitle>{translations.system[language]}</CardTitle>
              <CardDescription className="text-blue-100">
                {translations.operational[language]}
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
