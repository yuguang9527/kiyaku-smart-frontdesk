
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Phone, PhoneCall } from 'lucide-react';
import { generateIncomingCallResponse, generateVoiceResponse, TwilioWebhookData } from '@/services/twilio';

const TwilioSimulator: React.FC = () => {
  const [incomingNumber, setIncomingNumber] = useState('+818012345678');
  const [userQuery, setUserQuery] = useState('予約の確認をしたいです');
  const [responseXml, setResponseXml] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // 着信通話のシミュレーション
  const simulateIncomingCall = () => {
    const callData: TwilioWebhookData = {
      CallSid: `CALL${Math.random().toString(36).substring(2, 11)}`,
      From: incomingNumber,
      To: '+14788001081', // 新しいTwilio番号を使用
      CallStatus: 'ringing',
    };
    
    const response = generateIncomingCallResponse(callData);
    setResponseXml(response);
    
    toast({
      title: "着信シミュレーション",
      description: `${incomingNumber}からの着信をシミュレーション`,
    });
  };

  // 音声応答のシミュレーション
  const simulateVoiceResponse = async () => {
    setIsProcessing(true);
    
    try {
      const callData: TwilioWebhookData = {
        CallSid: `CALL${Math.random().toString(36).substring(2, 11)}`,
        From: incomingNumber,
        To: '+14788001081', // 新しいTwilio番号を使用
        CallStatus: 'in-progress',
        SpeechResult: userQuery,
      };
      
      const response = await generateVoiceResponse(callData);
      setResponseXml(response);
      
      toast({
        title: "AI応答が生成されました",
        description: "音声クエリに対するAI応答が生成されました",
      });
    } catch (error) {
      console.error('Error generating voice response:', error);
      toast({
        title: "エラーが発生しました",
        description: "応答の生成中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PhoneCall className="h-5 w-5" />
          <span>Twilioシミュレータ</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="incoming-number" className="text-sm font-medium">
            発信元番号
          </label>
          <input
            id="incoming-number"
            className="w-full p-2 border rounded"
            value={incomingNumber}
            onChange={(e) => setIncomingNumber(e.target.value)}
            placeholder="+818012345678"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={simulateIncomingCall} className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <span>着信をシミュレート</span>
          </Button>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <label htmlFor="user-query" className="text-sm font-medium">
            ユーザーの音声クエリ
          </label>
          <Textarea
            id="user-query"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="予約の確認をしたいです"
            rows={3}
          />
        </div>

        <Button 
          onClick={simulateVoiceResponse} 
          disabled={isProcessing || !userQuery.trim()} 
          className="w-full"
        >
          {isProcessing ? '処理中...' : 'AI応答をシミュレート'}
        </Button>

        {responseXml && (
          <div className="space-y-2 pt-4 border-t">
            <label className="text-sm font-medium">TwiML応答</label>
            <div className="bg-gray-50 p-3 rounded border font-mono text-xs overflow-auto max-h-60">
              {responseXml}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwilioSimulator;

