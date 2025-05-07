
// Twilio接続サービス

// Twilioのクレデンシャル
// 注: 实际使用时应从环境变量获取
const TWILIO_ACCOUNT_SID = 'AC81e62b3089fa4a6d77985129b3036000'; 
const TWILIO_AUTH_TOKEN = '47004d9657e812409aa2890c540ad521';
const TWILIO_PHONE_NUMBER = '+14788001081'; // 更新为新的Twilio号码
const TWILIO_RECOVERY_CODE = '43UVBN4T2L5ARG1SRZ129YJ3'; // 恢复代码

// AIの応答を生成するためのgroqサービスをインポート
import { generateResponse } from './groq';

// Twilioのウェブフックに対応するためのインターフェース
export interface TwilioWebhookData {
  CallSid: string;
  From: string;
  To: string;
  CallStatus: string;
  SpeechResult?: string;
}

/**
 * 着信通话に対する応答XMLを生成
 * TwiMLドキュメントとしてレスポンスを返します
 */
export const generateIncomingCallResponse = (callData: TwilioWebhookData): string => {
  // 基本的な挨拶メッセージ
  console.log('Incoming call detected from:', callData.From);
  const greeting = `
    <Response>
      <Say language="zh-CN">欢迎致电Yotta客户支持。我们的AI助手将为您服务。</Say>
      <Pause length="1"/>
      <Say language="en-US">Welcome to Yotta customer support. Our AI assistant will help you.</Say>
      <Gather input="speech" timeout="5" language="zh-CN">
        <Say language="zh-CN">请问有什么可以帮到您？</Say>
        <Pause length="1"/>
        <Say language="en-US">How may I help you today?</Say>
      </Gather>
      <Say language="zh-CN">没有听到您的请求，稍后请再次来电。</Say>
      <Hangup/>
    </Response>
  `;
  return greeting;
};

/**
 * 音声入力に基づいてAIの応答を生成
 */
export const generateVoiceResponse = async (callData: TwilioWebhookData): Promise<string> => {
  if (!callData.SpeechResult) {
    // 音声認識結果がない場合
    return `
      <Response>
        <Say language="zh-CN">非常抱歉，我没有听清。请再说一次。</Say>
        <Pause length="1"/>
        <Say language="en-US">I'm sorry, I didn't catch that. Please try again.</Say>
        <Gather input="speech" timeout="5" language="zh-CN"/>
        <Say language="zh-CN">没有听到您的回应，谢谢您的来电。</Say>
        <Hangup/>
      </Response>
    `;
  }

  try {
    console.log('Processing speech input:', callData.SpeechResult);
    // AIを使用して応答を生成
    const aiResponse = await generateResponse([
      { role: 'user', content: callData.SpeechResult }
    ]);
    
    console.log('AI generated response:', aiResponse);

    // AIの応答をTwiML形式で返す
    return `
      <Response>
        <Say language="${/[\u4e00-\u9fa5]/.test(callData.SpeechResult) ? 'zh-CN' : 'en-US'}">${aiResponse}</Say>
        <Pause length="1"/>
        <Gather input="speech" timeout="5" language="zh-CN">
          <Say language="zh-CN">还有其他问题吗？</Say>
          <Pause length="1"/>
          <Say language="en-US">Do you have any other questions?</Say>
        </Gather>
        <Say language="zh-CN">感谢您的来电，再见。</Say>
        <Hangup/>
      </Response>
    `;
  } catch (error) {
    console.error('AI应答生成错误:', error);
    // エラー時の応答
    return `
      <Response>
        <Say language="zh-CN">非常抱歉，系统当前遇到了问题。请稍后再试。</Say>
        <Pause length="1"/>
        <Say language="en-US">I apologize, but we're experiencing system issues. Please try again later.</Say>
        <Hangup/>
      </Response>
    `;
  }
};

// 电话的发信功能（デモ用）
export const initiateOutboundCall = async (toNumber: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Initiating call to ${toNumber} from ${TWILIO_PHONE_NUMBER}`);
    // 实际的Twilio设置时会在此使用Twilio API进行拨号
    // 现在仅模拟拨号过程
    
    // 使用实际的Twilio API示例（如果需要激活，请移除注释并配置正确的客户端）
    /*
    const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    const call = await client.calls.create({
      url: 'https://your-webhook-url.com/voice',
      to: toNumber,
      from: TWILIO_PHONE_NUMBER
    });
    console.log('Call initiated with SID:', call.sid);
    */
    
    return {
      success: true,
      message: `Simulating call to ${toNumber}`
    };
  } catch (error) {
    console.error('Failed to initiate call:', error);
    return {
      success: false,
      message: 'Failed to initiate call'
    };
  }
};
