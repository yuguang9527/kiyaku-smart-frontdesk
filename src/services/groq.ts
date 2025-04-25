
import { Groq } from 'groq-sdk';

// API key from environment variables
const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';

// Create Groq client only if API key is available
const client = apiKey ? new Groq({
  apiKey,
  dangerouslyAllowBrowser: true, // Required flag for browser usage
}) : null;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Sample responses for when API key is not available
const fallbackResponses = {
  ja: [
    "いらっしゃいませ。当旅館へのご関心をありがとうございます。",
    "チェックイン時間は午後3時からとなっております。",
    "朝食は朝7時から9時までご利用いただけます。",
    "ご不明な点がございましたら、どうぞお気軽にお尋ねください。",
    "お客様のご滞在が快適なものになりますよう、スタッフ一同心よりお待ちしております。",
  ],
  en: [
    "Welcome to our ryokan. Thank you for your interest.",
    "Check-in time is from 3:00 PM.",
    "Breakfast is available from 7:00 AM to 9:00 AM.",
    "If you have any questions, please feel free to ask.",
    "Our staff is looking forward to making your stay comfortable.",
  ]
};

export const generateResponse = async (messages: Message[]) => {
  try {
    // Check if we have a valid client
    if (!client) {
      // Return a fallback response based on the user input language
      const userMessage = messages[messages.length - 1].content;
      const isEnglish = /[a-zA-Z]/.test(userMessage) && !/[あ-んア-ン]/.test(userMessage);
      const responses = isEnglish ? fallbackResponses.en : fallbackResponses.ja;
      const randomIndex = Math.floor(Math.random() * responses.length);
      return responses[randomIndex];
    }

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `あなたは丁寧で礼儀正しい旅館のフロントAIです。
以下の情報を参考に、お客様の質問に日本語で的確に答えてください：

- チェックイン時間は午後3時からです。
- 朝食は朝7時〜9時に提供しています。
- 英語対応も可能です。
- 予約確認には予約者名と予約サイトが必要です。
- 常にお客様に敬語を使い、丁寧に応対してください。
- 分からないことは正直にお詫びして、フロントにお問い合わせいただくようご案内ください。`
        },
        ...messages
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    
    // Return a more polite fallback message in Japanese
    return '大変申し訳ございませんが、ただいまシステムが混み合っております。少々お待ちいただくか、フロントデスクまでお越しください。';
  }
};
