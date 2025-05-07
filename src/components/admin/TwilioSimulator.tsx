
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Phone, PhoneCall } from 'lucide-react';
import { generateIncomingCallResponse, generateVoiceResponse, TwilioWebhookData } from '@/services/twilio';

const TwilioSimulator: React.FC = () => {
  const [incomingNumber, setIncomingNumber] = useState('+818012345678');
  const [userQuery, setUserQuery] = useState('我想确认我的预订');
  const [responseXml, setResponseXml] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // 着信通话的模拟
  const simulateIncomingCall = () => {
    const callData: TwilioWebhookData = {
      CallSid: `CALL${Math.random().toString(36).substring(2, 11)}`,
      From: incomingNumber,
      To: '+16506618978',
      CallStatus: 'ringing',
    };
    
    const response = generateIncomingCallResponse(callData);
    setResponseXml(response);
    
    toast({
      title: "模拟来电",
      description: `模拟来自${incomingNumber}的来电`,
    });
  };

  // 语音回答的模拟
  const simulateVoiceResponse = async () => {
    setIsProcessing(true);
    
    try {
      const callData: TwilioWebhookData = {
        CallSid: `CALL${Math.random().toString(36).substring(2, 11)}`,
        From: incomingNumber,
        To: '+16506618978',
        CallStatus: 'in-progress',
        SpeechResult: userQuery,
      };
      
      const response = await generateVoiceResponse(callData);
      setResponseXml(response);
      
      toast({
        title: "AI回答已生成",
        description: "针对语音查询的AI回答已生成",
      });
    } catch (error) {
      console.error('Error generating voice response:', error);
      toast({
        title: "发生错误",
        description: "生成回答时发生错误",
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
          <span>Twilio模拟器</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="incoming-number" className="text-sm font-medium">
            来电号码
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
            <span>模拟来电</span>
          </Button>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <label htmlFor="user-query" className="text-sm font-medium">
            用户语音查询
          </label>
          <Textarea
            id="user-query"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="我想确认我的预订"
            rows={3}
          />
        </div>

        <Button 
          onClick={simulateVoiceResponse} 
          disabled={isProcessing || !userQuery.trim()} 
          className="w-full"
        >
          {isProcessing ? '处理中...' : '模拟AI回答'}
        </Button>

        {responseXml && (
          <div className="space-y-2 pt-4 border-t">
            <label className="text-sm font-medium">TwiML回答</label>
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
