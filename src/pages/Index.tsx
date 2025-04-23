
import React, { useState } from 'react';
import MainNav from '@/components/MainNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '@/components/ChatInterface';
import QuickAction from '@/components/QuickAction';
import ReservationCard from '@/components/ReservationCard';
import { recentReservations } from '@/data/reservations';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Bell, Calendar, Check, MessageSquare, Phone, UserPlus } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const translations = {
    title: {
      ja: 'Kiyakuスマートフロントデスク',
      en: 'Kiyaku Smart Front Desk'
    },
    welcome: {
      ja: 'ようこそ',
      en: 'Welcome'
    },
    todaySummary: {
      ja: '本日の概要',
      en: 'Today\'s Summary'
    },
    guestAssistant: {
      ja: 'ゲストアシスタント',
      en: 'Guest Assistant'
    },
    upcomingReservations: {
      ja: '直近の予約',
      en: 'Upcoming Reservations'
    },
    quickActions: {
      ja: 'クイックアクション',
      en: 'Quick Actions'
    },
    newReservation: {
      ja: '新規予約',
      en: 'New Reservation'
    },
    checkInGuest: {
      ja: 'チェックイン',
      en: 'Check In'
    },
    guestMessage: {
      ja: 'メッセージ',
      en: 'Message'
    },
    manageCall: {
      ja: '通話対応',
      en: 'Manage Call'
    }
  };

  const stats = [
    { label: language === 'ja' ? 'チェックイン予定' : 'Check-ins Today', value: 3 },
    { label: language === 'ja' ? 'チェックアウト予定' : 'Check-outs Today', value: 2 },
    { label: language === 'ja' ? '新規予約' : 'New Bookings', value: 1 },
    { label: language === 'ja' ? 'メッセージ' : 'Messages', value: 5 },
  ];
  
  const quickActions = [
    { 
      icon: <UserPlus className="h-6 w-6" />, 
      label: translations.newReservation[language],
      onClick: () => toast({ title: "予約機能", description: "新規予約作成画面を開きます" }) 
    },
    { 
      icon: <Check className="h-6 w-6" />, 
      label: translations.checkInGuest[language],
      onClick: () => toast({ title: "チェックイン", description: "チェックイン処理画面を開きます" }) 
    },
    { 
      icon: <MessageSquare className="h-6 w-6" />, 
      label: translations.guestMessage[language],
      onClick: () => toast({ title: "メッセージ", description: "メッセージ画面を開きます" }) 
    },
    { 
      icon: <Phone className="h-6 w-6" />, 
      label: translations.manageCall[language],
      onClick: () => toast({ title: "電話", description: "電話対応画面を開きます" }) 
    },
  ];

  return (
    <div className="flex min-h-screen flex-col washi-bg">
      <MainNav />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <Card key={i} className="slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <CardContent className="p-4 flex flex-col justify-center items-center">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chat Interface */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{translations.guestAssistant[language]}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChatInterface 
                  title={language === 'ja' ? "AIサポート" : "AI Support"} 
                  hotelInfo={{
                    name: 'さくらリヤカン',
                    greeting: language === 'ja' 
                      ? 'いらっしゃいませ。ご質問があればお気軽にどうぞ。' 
                      : 'Welcome to Sakura Ryokan. How may I assist you today?'
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="fade-in">
              <CardHeader className="pb-3">
                <CardTitle>{translations.quickActions[language]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, i) => (
                    <QuickAction
                      key={i}
                      icon={action.icon}
                      label={action.label}
                      onClick={action.onClick}
                      variant={i === 0 ? "default" : "outline"}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Reservations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{translations.upcomingReservations[language]}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                {recentReservations.map((reservation) => (
                  <ReservationCard 
                    key={reservation.id}
                    {...reservation}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
