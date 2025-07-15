import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import AdminNav from '@/components/admin/AdminNav';
import { MessageSquare, Phone, Calendar, Settings, User, ArrowUp, ArrowDown, BarChart3, Activity, Check, Clock, Plane } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import SupportHistoryDialog from '@/components/SupportHistoryDialog';
import { apiService } from '@/services/api';

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeInquiryTab, setActiveInquiryTab] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [inquiryStatuses, setInquiryStatuses] = useState<{ [key: string]: string }>({
    'support-001': 'resolved',
    'support-002': 'in-progress', 
    'support-003': 'new'
  });
  const [reservations, setReservations] = useState<any[]>([]);
  const [twillioCalls, setTwillioCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch reservations
        const reservationsResponse = await apiService.getReservations();
        if (reservationsResponse.success) {
          setReservations(reservationsResponse.data);
        }

        // Fetch Twilio calls (if endpoint exists)
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://responsible-expression-production.up.railway.app/api'}/twilio/calls`);
          if (response.ok) {
            const callsData = await response.json();
            if (callsData.success) {
              setTwillioCalls(callsData.data);
            }
          }
        } catch (callError) {
          console.log('Calls data not available:', callError);
        }
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({
          title: language === 'ja' ? 'データの取得に失敗しました' : 'Failed to fetch data',
          description: language === 'ja' ? 'サーバーからデータを取得できませんでした' : 'Could not retrieve data from server',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, toast]);

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
      newReservationsSubtext: {
        ja: '過去24時間以内の予約件数',
        en: 'Reservations in the last 24 hours'
      },
      activeUsers: {
        ja: 'アクティブユーザー',
        en: 'Active Users'
      },
      incompleteChatsMessage: {
        ja: '未完了のチャットがあります。ご確認ください',
        en: 'There are incomplete chats. Please check them.'
      },
      incompleteChatsCount: {
        ja: '未完了のチャット件数',
        en: 'Incomplete chat count'
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
      },
      reservationNumber: {
        ja: '予約番号',
        en: 'Reservation #'
      },
      customerName: {
        ja: 'お客様名',
        en: 'Customer Name'
      },
      number: {
        ja: '番号',
        en: 'No.'
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

  // Convert Twilio calls to support inquiries format
  const inquiries = twillioCalls
    .filter(call => call.transcript && call.transcript.length > 0)
    .map((call, index) => ({
      id: call.callSid,
      title: call.transcript.includes('book') || call.transcript.includes('room') 
        ? (language === 'ja' ? '電話予約問い合わせ' : 'Phone booking inquiry')
        : (language === 'ja' ? '一般問い合わせ' : 'General inquiry'),
      time: Math.floor((new Date().getTime() - new Date(call.createdAt).getTime()) / (1000 * 60 * 60)), // hours ago
      status: call.status === 'COMPLETED' ? 'resolved' : 'in-progress',
      reservationNumber: call.summary?.includes('Reservation created:') 
        ? call.summary.split('Reservation created: ')[1]?.split(' ')[0] 
        : `CALL-${call.callSid.slice(-4)}`,
      customerName: call.summary?.includes('for ') 
        ? call.summary.split('for ')[1] 
        : `Guest ${call.to?.slice(-4) || 'Unknown'}`
    }))
    .slice(0, 10); // Show latest 10 inquiries

  const completedInquiries = inquiries.filter(inq => inq.status === 'resolved');
  const incompleteInquiries = inquiries.filter(inq => inq.status !== 'resolved');

  // Calculate real statistics
  const todaysCalls = twillioCalls.filter(call => {
    const callDate = new Date(call.createdAt);
    const today = new Date();
    return callDate.toDateString() === today.toDateString();
  }).length;

  // Filter out seed data and only show real reservations
  const realReservations = reservations.filter(reservation => 
    reservation.id.startsWith('res-') && reservation.guestEmail && reservation.guestEmail.includes('@')
  );

  const recentReservations = realReservations.filter(reservation => {
    const reservationDate = new Date(reservation.createdAt);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return reservationDate >= yesterday;
  }).length;

  const completedCalls = twillioCalls.filter(call => call.status === 'COMPLETED').length;

  const stats = [
    { 
      icon: <MessageSquare className="h-8 w-8 text-white" />, 
      value: incompleteInquiries.length, 
      label: translations.stats.chatRequests[language], 
      trend: "+12%",
      positive: true,
      key: "chatRequests"
    },
    { 
      icon: <Phone className="h-8 w-8 text-white" />, 
      value: todaysCalls, 
      label: translations.stats.phoneCallsToday[language], 
      trend: todaysCalls > 5 ? "+15%" : "-3%",
      positive: todaysCalls > 5,
      key: "calls"
    },
    { 
      icon: <Calendar className="h-8 w-8 text-white" />, 
      value: recentReservations, 
      label: translations.stats.newReservations[language], 
      subtext: translations.stats.newReservationsSubtext[language],
      trend: recentReservations > 0 ? "+100%" : "0%",
      positive: recentReservations > 0,
      key: "reservations"
    },
    { 
      icon: <User className="h-8 w-8 text-white" />, 
      value: completedCalls, 
      label: translations.stats.activeUsers[language], 
      trend: completedCalls > 3 ? "+25%" : "+8%",
      positive: true,
      key: "users"
    },
  ];

  const mainStats = stats.filter(stat => stat.key === "chatRequests" || stat.key === "reservations");
  const secondaryStats = stats.filter(stat => stat.key === "calls" || stat.key === "users");

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

  const getRowStyling = (status: string) => {
    if (status !== 'resolved') {
      return 'hover:bg-red-100 transition-colors cursor-pointer bg-red-50';
    }
    return 'hover:bg-blue-50 transition-colors cursor-pointer';
  };

  const handleCardClick = (statKey: string) => {
    if (statKey === 'reservations') {
      navigate('/admin/reservations');
    } else if (statKey === 'chatRequests') {
      setActiveInquiryTab('incomplete');
    }
  };

  const handleInquiryClick = (inquiryId: string) => {
    setSelectedInquiryId(inquiryId);
    setIsHistoryDialogOpen(true);
  };

  const handleStatusChange = (inquiryId: string, isCompleted: boolean) => {
    setInquiryStatuses(prev => ({
      ...prev,
      [inquiryId]: isCompleted ? 'resolved' : 'in-progress'
    }));
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
        {/* Header section */}
        <div className="mb-8 border-b border-blue-100 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold tracking-tight text-blue-800">
                {translations.title[language]}
              </h1>
            </div>
            <div className="flex space-x-3">
              {secondaryStats.map((stat, index) => (
                <Card key={index} className="w-40 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                  <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="bg-blue-500/20 p-1 rounded">
                        {React.cloneElement(stat.icon, { className: "h-4 w-4 text-blue-700" })}
                      </div>
                      <span className="text-xs font-medium text-blue-700">{stat.label}</span>
                    </div>
                    <Badge className={`${stat.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs px-1 py-0`}>
                      {stat.trend}
                    </Badge>
                  </div>
                  <div className="px-3 pb-2 pt-0">
                    <p className="text-lg font-bold text-blue-900">{stat.value}</p>
                  </div>
                </Card>
              ))}
            </div>
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

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mainStats.map((stat, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm cursor-pointer hover:scale-105`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
              }}
              onClick={() => handleCardClick(stat.key)}
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-700/50 p-3 rounded-lg backdrop-blur-sm">
                      {stat.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-lg font-medium">{stat.label}</span>
                      {stat.subtext && (
                        <span className="text-blue-100 text-xs">{stat.subtext}</span>
                      )}
                      {stat.key === 'chatRequests' && (
                        <span className="text-blue-100 text-xs">{translations.stats.incompleteChatsCount[language]}</span>
                      )}
                    </div>
                  </div>
                  <Badge className={`${stat.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} font-medium`}>
                    {stat.trend}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 bg-white/90">
                <h3 className="text-4xl font-bold text-blue-900">{stat.value}</h3>
                {stat.key === 'chatRequests' && incompleteInquiries.length > 0 && (
                  <p className="text-sm text-red-600 mt-2 font-medium">
                    {translations.stats.incompleteChatsMessage[language]}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Inquiries and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <TableHead className="w-16">{translations.inquiries.number[language]}</TableHead>
                      <TableHead>{language === 'ja' ? '問い合わせ' : 'Inquiry'}</TableHead>
                      <TableHead>{translations.inquiries.reservationNumber[language]}</TableHead>
                      <TableHead>{translations.inquiries.customerName[language]}</TableHead>
                      <TableHead>{language === 'ja' ? '時間' : 'Time'}</TableHead>
                      <TableHead>{language === 'ja' ? 'ステータス' : 'Status'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredInquiries().map((inquiry, index) => (
                      <TableRow 
                        key={inquiry.id} 
                        className={getRowStyling(inquiry.status)}
                        onClick={() => handleInquiryClick(inquiry.id)}
                      >
                        <TableCell className="font-medium text-blue-700">#{index + 1}</TableCell>
                        <TableCell className="font-medium text-blue-900">{inquiry.title}</TableCell>
                        <TableCell className="text-sm text-blue-600">{inquiry.reservationNumber}</TableCell>
                        <TableCell className="text-sm text-blue-800">{inquiry.customerName}</TableCell>
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
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
              <CardTitle>
                {language === 'ja' ? '最新の予約' : 'Recent Reservations'}
              </CardTitle>
              <CardDescription className="text-purple-100">
                {language === 'ja' ? 'システムから取得された実際の予約データ' : 'Real reservation data from system'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-purple-100 max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-purple-600">
                    {language === 'ja' ? 'データを読み込み中...' : 'Loading data...'}
                  </div>
                ) : realReservations.length === 0 ? (
                  <div className="p-4 text-center text-purple-600">
                    {language === 'ja' ? '真実の予約データがありません' : 'No real reservation data found'}
                  </div>
                ) : (
                  realReservations.slice(0, 5).map((reservation, i) => (
                    <div key={reservation.id} className="flex items-center justify-between p-4 hover:bg-purple-50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-purple-800">{reservation.guestName}</p>
                        <p className="text-sm text-purple-600">{reservation.guestEmail}</p>
                        <p className="text-xs text-purple-500">
                          {language === 'ja' ? '予約番号' : 'ID'}: {reservation.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-purple-700">{reservation.roomType}</p>
                        <p className="text-xs text-purple-600">${reservation.totalAmount}/night</p>
                        <Badge className={`text-xs ${reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {reservation.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {realReservations.length > 5 && (
                <div className="p-3 bg-purple-50 text-center">
                  <button 
                    onClick={() => navigate('/admin/reservations')}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    {language === 'ja' ? `他の ${realReservations.length - 5} 件を表示` : `View ${realReservations.length - 5} more`}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white">
              <CardTitle>{translations.system[language]}</CardTitle>
              <CardDescription className="text-green-100">
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

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-blue-400">
          <p>&copy; 2025 Yotta! {language === 'ja' ? '管理システム' : 'Admin System'}</p>
        </div>
      </main>

      {/* Support History Dialog */}
      <SupportHistoryDialog
        reservationId={selectedInquiryId}
        isOpen={isHistoryDialogOpen}
        onClose={() => {
          setIsHistoryDialogOpen(false);
          setSelectedInquiryId(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AdminDashboard;
