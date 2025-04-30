
import React, { useState } from 'react';
import { Phone, MicOff, Mic, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/hooks/use-language';

type PhoneAgentStatus = 'idle' | 'calling' | 'connected';

interface PhoneAgentProps {
  agentName?: string;
}

const PhoneAgent: React.FC<PhoneAgentProps> = ({ agentName = 'Yotta!' }) => {
  const [status, setStatus] = useState<PhoneAgentStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
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
    stopTimer();
    toast({
      title: translations.callEnded[language],
    });
  };

  // ミュート切り替え
  const toggleMute = () => {
    setIsMuted(!isMuted);
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
    <div className="flex flex-col items-center p-6 space-y-4">
      {status === 'idle' ? (
        <Button 
          variant="default" 
          size="lg" 
          className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90" 
          onClick={handleStartCall}
        >
          <Phone className="h-5 w-5" />
          <span>{translations.startCall[language]}</span>
        </Button>
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
    </div>
  );
};

export default PhoneAgent;
