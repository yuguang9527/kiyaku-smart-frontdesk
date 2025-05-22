import React, { useState, useEffect } from 'react';
import { Phone, MicOff, Mic, PhoneOff, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Card } from '@/components/ui/card';
import { initiateOutboundCall } from '@/services/twilio';

type PhoneAgentStatus = 'idle' | 'calling' | 'connected';

interface PhoneAgentProps {
  agentName?: string;
  phoneNumber?: string;
  hotelAddress?: string;
}

const PhoneAgent: React.FC<PhoneAgentProps> = ({ 
  agentName = 'Yotta!',
  phoneNumber = '+14788001081',
  hotelAddress = '123 Main St, Tokyo, Japan'
}) => {
  const [status, setStatus] = useState<PhoneAgentStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
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
      ja: '電話を掛ける',
      en: 'Make a call'
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
    hotelName: {
      ja: 'ホテル名',
      en: 'Hotel'
    },
    phoneNumber: {
      ja: '電話番号',
      en: 'Phone number'
    },
    hotelAddress: {
      ja: '住所',
      en: 'Address'
    }
  };

  // 通話の開始
  const handleStartCall = () => {
    setStatus('calling');
    setTranscript('');
    setAiResponse('');
    
    // 1.5秒後に通話が繋がる演出
    setTimeout(() => {
      setStatus('connected');
      startTimer();
      toast({
        title: translations.callStarted[language],
        description: `${agentName} ${language === 'ja' ? 'サポートへようこそ。' : 'support at your service.'}`,
      });
      
      // シミュレートされた転写を開始
      startSimulatedTranscription();
    }, 1500);
  };

  // シミュレートされた転写の開始
  const startSimulatedTranscription = () => {
    // シミュレートされたユーザー音声の例
    const simulatedUserMessages = [
      { text: language === 'ja' ? 'こんにちは、部屋の予約状況を教えてください' : 'Hello, can you tell me about room availability?', delay: 5000 },
      { text: language === 'ja' ? '来週末空いている部屋はありますか？' : 'Do you have any rooms available next weekend?', delay: 15000 },
      { text: language === 'ja' ? '朝食付きのプランはありますか？' : 'Do you have any plans that include breakfast?', delay: 25000 }
    ];
    
    simulatedUserMessages.forEach((message, index) => {
      setTimeout(() => {
        if (status === 'connected') {
          setTranscript(message.text);
          handleUserMessage(message.text);
        }
      }, message.delay);
    });
  };

  // ユーザーメッセージの処理
  const handleUserMessage = async (message: string) => {
    setIsProcessing(true);
    
    // AIレスポンスをシミュレート
    setTimeout(() => {
      const responses = {
        ja: [
          '当ホテルにお問い合わせいただきありがとうございます。現在の予約状況をお調べします。',
          '来週末はいくつか空室がございます。ダブルルームが3室、スイートルームが1室ご利用いただけます。ご予約はお早めにお願いいたします。',
          'はい、朝食付きのプランもございます。和食と洋食からお選びいただけます。朝食付きプランは通常料金に1泊あたり2,000円追加となります。'
        ],
        en: [
          'Thank you for contacting our hotel. Let me check the current reservation status for you.',
          'We have several rooms available next weekend. There are 3 double rooms and 1 suite room available. We recommend booking early.',
          'Yes, we do have plans that include breakfast. You can choose between Japanese and Western breakfast. Breakfast plans add $20 per night to the standard rate.'
        ]
      };
      
      const responseIndex = transcript.includes('朝食') || transcript.includes('breakfast') ? 2 :
                            transcript.includes('来週') || transcript.includes('next weekend') ? 1 : 0;
      
      setAiResponse(responses[language][responseIndex]);
      setIsProcessing(false);
    }, 2000);
  };

  // 実際に電話をかける - Twilioを使って実際の通話を開始
  const handleRealCall = async () => {
    if (phoneNumber) {
      try {
        const result = await initiateOutboundCall(phoneNumber);
        
        if (result.success) {
          toast({
            title: language === 'ja' ? '通話を開始しています' : 'Initiating call',
            description: result.message
          });
        } else {
          toast({
            title: language === 'ja' ? '通話の開始に失敗しました' : 'Failed to initiate call',
            description: result.message,
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: language === 'ja' ? 'エラーが発生しました' : 'Error occurred',
          description: String(error),
          variant: "destructive"
        });
      }
    }
  };

  // 通話の終了
  const handleEndCall = () => {
    setStatus('idle');
    setCallDuration(0);
    setTranscript('');
    setAiResponse('');
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
    <>
      <div className="flex flex-col items-center p-4 space-y-4">
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
            
            {/* Updated hotel info section - Left-aligned */}
            <div className="mt-2 text-left space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-muted-foreground">{translations.hotelName[language]}:</span>
                <span className="text-sm font-bold">{agentName}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-muted-foreground">{translations.hotelAddress[language]}:</span>
                <span className="text-sm font-bold">{hotelAddress}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-muted-foreground">{translations.phoneNumber[language]}:</span>
                <span className="text-sm font-bold">{phoneNumber}</span>
              </div>
            </div>
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
            
            {/* トランスクリプトと応答の表示 */}
            {status === 'connected' && (
              <div className="w-full space-y-3 mb-4">
                {transcript && (
                  <Card className="p-3 bg-blue-50 text-blue-800">
                    <div className="text-sm text-blue-600 mb-1 font-medium">
                      {language === 'ja' ? 'あなた:' : 'You:'}
                    </div>
                    <div>{transcript}</div>
                  </Card>
                )}
                
                {(isProcessing || aiResponse) && (
                  <Card className="p-3 bg-green-50 text-green-800">
                    <div className="text-sm text-green-600 mb-1 font-medium">
                      {agentName}:
                    </div>
                    <div>
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse">{language === 'ja' ? '応答を生成中...' : 'Generating response...'}</div>
                          <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></div>
                        </div>
                      ) : aiResponse}
                    </div>
                  </Card>
                )}
              </div>
            )}
            
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

      {/* Single combined section for Twilio and call center when idle */}
      {status === 'idle' && (
        <div className="w-full mt-8">
          {/* Call center box with Twilio info integrated */}
          <div className="text-center p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-semibold text-blue-900">
              {language === 'ja' ? '24時間対応コールセンター' : '24-Hour Call Center'}
            </h3>
            <p className="text-slate-600 mt-3 mb-5">
              {language === 'ja' 
                ? 'AIスタッフがお電話でサポートいたします。' 
                : 'Our AI staff will assist you by phone.'}
            </p>
            <div className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 pt-2">
              {phoneNumber}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'ja' 
                ? '(24時間・年中無休)' 
                : '(24 hours, 365 days)'}
            </p>

            {/* Twilio integration info */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4 text-sm mx-auto max-w-lg">
              <div className="flex items-start gap-2">
                <Server className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <h4 className="font-medium text-blue-800 text-left">
                    {language === 'ja' ? 'Twilio Media Streams & AssemblyAI 統合' : 'Twilio Media Streams & AssemblyAI Integration'}
                  </h4>
                  <p className="mt-1 text-blue-700 text-left">
                    {language === 'ja' 
                      ? 'このシステムはTwilio Media StreamsとAssemblyAIの実時間音声認識を統合して、AIアシスタントとの自然な会話を可能にします。' 
                      : 'This system integrates Twilio Media Streams with AssemblyAI real-time speech recognition to enable natural conversations with AI assistants.'}
                  </p>
                  <p className="mt-2 text-xs opacity-75 text-left">
                    WebSocket: wss://yourdomain.com:8765
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhoneAgent;
