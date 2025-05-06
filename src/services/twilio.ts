// Twilio接続サービス

// Twilioのクレデンシャル
// 注: 実際の使用では環境変数から取得するべきです
const TWILIO_ACCOUNT_SID = 'AC81e62b3089fa4a6d77985129b3036000'; 
const TWILIO_AUTH_TOKEN = '47004d9657e812409aa2890c540ad521';
const TWILIO_PHONE_NUMBER = '+16506618978'; // 確認済みのTwilio番号
const TWILIO_RECOVERY_CODE = '43UVBN4T2L5ARG1SRZ129YJ3'; // リカバリーコード

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
 * 着信通話に対する応答XMLを生成
 * TwiMLドキュメントとしてレスポンスを返します
 */
export const generateIncomingCallResponse = (callData: TwilioWebhookData): string => {
  // 基本的な挨拶メッセージ
  const greeting = `
    <Response>
      <Say language="ja-JP">Yottaカスタマーサポートへようこそ。AIアシスタントがお答えします。</Say>
      <Gather input="speech" timeout="3" language="ja-JP">
        <Say language="ja-JP">ご用件をどうぞお話ください。</Say>
      </Gather>
      <Say language="ja-JP">応答がありませんでした。またのお電話をお待ちしております。</Say>
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
        <Say language="ja-JP">すみません、お聞き取りできませんでした。もう一度お願いします。</Say>
        <Gather input="speech" timeout="3" language="ja-JP"/>
        <Say language="ja-JP">応答がありませんでした。またのお電話をお待ちしております。</Say>
        <Hangup/>
      </Response>
    `;
  }

  try {
    // AIを使用して応答を生成
    const aiResponse = await generateResponse([
      { role: 'user', content: callData.SpeechResult }
    ]);

    // AIの応答をTwiML形式で返す
    return `
      <Response>
        <Say language="ja-JP">${aiResponse}</Say>
        <Pause length="1"/>
        <Gather input="speech" timeout="3" language="ja-JP">
          <Say language="ja-JP">他にご質問はありますか？</Say>
        </Gather>
        <Say language="ja-JP">ありがとうございました。またのお電話をお待ちしております。</Say>
        <Hangup/>
      </Response>
    `;
  } catch (error) {
    console.error('AI応答の生成エラー:', error);
    // エラー時の応答
    return `
      <Response>
        <Say language="ja-JP">申し訳ありません。現在システムに問題が発生しています。後ほどおかけ直しください。</Say>
        <Hangup/>
      </Response>
    `;
  }
};

// 電話の発信機能（デモ用）
export const initiateOutboundCall = async (toNumber: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Initiating call to ${toNumber} from ${TWILIO_PHONE_NUMBER}`);
    // 実際のTwilioセットアップ時はここでTwilio APIを使って発信します
    // デモ用なのでAPIコールは実装せず、発信をシミュレート
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
