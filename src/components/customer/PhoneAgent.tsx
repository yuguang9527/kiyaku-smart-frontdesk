
import React, { useState } from 'react';
import { Phone, MicOff, Mic, PhoneOff, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { recentReservations } from '@/data/reservations';
import { Input } from '@/components/ui/input';

type PhoneAgentStatus = 'idle' | 'calling' | 'connected';

interface PhoneAgentProps {
  agentName?: string;
  phoneNumber?: string;
  enableReservationLookup?: boolean;
}

const PhoneAgent: React.FC<PhoneAgentProps> = ({ 
  agentName = 'Yotta!',
  phoneNumber = '+14788001081',
  enableReservationLookup = true
}) => {
  const [status, setStatus] = useState<PhoneAgentStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [reservationId, setReservationId] = useState('');
  const [reservationResult, setReservationResult] = useState<any>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const translations = {
    calling: {
      ja: '呼び出し中...',
      en: 'Calling...'
    },
    connected: {
      ja: '通話中',
      en: 'Connected'
    },
    startCall: {
      ja: 'エージェントに電話する',
      en: 'Call Agent'
    },
    endCall: {
      ja: '通話を終了',
      en: 'End Call'
    },
    mute: {
      ja: 'ミュート',
      en: 'Mute'
    },
    unmute: {
      ja: 'ミュート解除',
      en: 'Unmute'
    },
    callStarted: {
      ja: 'エージェントが応答しました',
      en: 'Agent has answered your call'
    },
    callEnded: {
      ja: '通話が終了しました',
      en: 'Call has ended'
    },
    realCall: {
      ja: '実際に電話をかける',
      en: 'Make a real call'
    },
    reservationLookup: {
      ja: '予約を検索',
      en: 'Search Reservation'
    },
    enterReservationId: {
      ja: '予約IDを入力',
      en: 'Enter Reservation ID'
    },
    search: {
      ja: '検索',
      en: 'Search'
    },
    reservationFound: {
      ja: '予約が見つかりました',
      en: 'Reservation found'
    },
    reservationNotFound: {
      ja: '予約が見つかりませんでした',
      en: 'Reservation not found'
    },
    hotelReservation: {
      ja: 'ホテル予約代理',
      en: 'Hotel Reservation Agent'
    }
  };

  // 通話の開始
  const handleStartCall = () => {
    setStatus('calling');
    
    // 1.5秒後に通話が繋がる演出
    setTimeout(() => {
      setStatus('connected');
      startTimer();
      toast({
        title: translations.callStarted[language],
        description: `${agentName} ${language === 'ja' ? 'サポートへようこそ。' : 'support at your service.'}`,
      });
    }, 1500);
  };

  // 通話の終了
  const handleEndCall = () => {
    setStatus('idle');
    setCallDuration(0);
    setReservationResult(null);
    stopTimer();
    toast({
      title: translations.callEnded[language],
    });
  };

  // 実際に電話をかける
  const handleRealCall = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  // ミュート切り替え
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // 予約を検索する
  const handleSearchReservation = () => {
    if (!reservationId.trim()) {
      toast({
        title: translations.reservationNotFound[language],
        variant: "destructive"
      });
      return;
    }
    
    // 予約データから検索
    const found = recentReservations.find(res => res.id === reservationId);
    
    if (found) {
      setReservationResult(found);
      toast({
        title: translations.reservationFound[language],
      });
    } else {
      setReservationResult(null);
      toast({
        title: translations.reservationNotFound[language],
        variant: "destructive"
      });
    }
  };

  // タイマー関連の状態管理
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // タイマー開始
  const startTimer = () => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // タイマー停止
  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // 通話時間のフォーマット
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div className="w-full text-center">
        <h3 className="text-lg font-semibold mb-2">
          {translations.hotelReservation[language]}
        </h3>
      </div>
      
      {status === 'idle' ? (
        <div className="w-full space-y-4">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90" 
            onClick={handleStartCall}
          >
            <Phone className="h-5 w-5" />
            <span>{translations.startCall[language]}</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full flex items-center gap-2"
            onClick={handleRealCall}
          >
            <Phone className="h-5 w-5" />
            <span>{translations.realCall[language]}</span>
          </Button>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="flex flex-col items-center mb-4 text-center">
            <div className={`text-xl font-medium ${status === 'calling' ? 'animate-pulse text-amber-500' : 'text-green-500'}`}>
              {status === 'calling' ? translations.calling[language] : translations.connected[language]}
            </div>
            {status === 'connected' && (
              <div className="text-lg mt-2">
                {formatCallDuration(callDuration)}
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4 w-full">
            <Button 
              variant="outline" 
              className={`flex-1 ${isMuted ? 'bg-red-50 border-red-200 text-red-500' : ''}`} 
              onClick={toggleMute} 
              disabled={status === 'calling'}
            >
              {isMuted ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" />
                  <span>{translations.unmute[language]}</span>
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  <span>{translations.mute[language]}</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={handleEndCall}
            >
              <PhoneOff className="mr-2 h-4 w-4" />
              <span>{translations.endCall[language]}</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* 予約検索機能 */}
      {enableReservationLookup && (
        <div className="w-full mt-4 pt-4 border-t">
          <h4 className="text-md font-medium mb-2">
            {translations.reservationLookup[language]}
          </h4>
          
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder={translations.enterReservationId[language]}
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
            />
            <Button 
              variant="secondary"
              onClick={handleSearchReservation}
              disabled={status === 'calling' || !reservationId.trim()}
            >
              <Search className="h-4 w-4 mr-1" />
              {translations.search[language]}
            </Button>
          </div>
          
          {/* 予約検索結果 */}
          {reservationResult && (
            <div className="border rounded-md p-3 bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{reservationResult.guestName}</div>
                <div className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {language === 'ja' ? '確認済み' : 'Confirmed'}
                </div>
              </div>
              <div className="text-sm flex items-center mb-1">
                <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
                {reservationResult.checkIn} - {reservationResult.checkOut}
              </div>
              <div className="text-sm">
                {reservationResult.roomType}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhoneAgent;
