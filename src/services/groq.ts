
import { Groq } from 'groq';

const client = new Groq();

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const generateResponse = async (messages: Message[]) => {
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `あなたは丁寧で礼儀正しい旅館のフロントAIです。
以下の情報を参考に、お客様の質問に日本語で的確に答えてください：

- チェックイン時間は午後3時からです。
- 朝食は朝7時〜9時に提供しています。
- 英語対応も可能です。
- 予約確認には予約者名と予約サイトが必要です。`
        },
        ...messages
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    return '申し訳ございません。ただいま一時的にシステムに問題が発生しております。';
  }
};
