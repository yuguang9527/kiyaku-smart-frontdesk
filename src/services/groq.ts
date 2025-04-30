
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

// 酒店常见问题和回答
const hotelFAQ = {
  "空室状況を教えてください": "ありがとうございます。ご希望の日程を教えていただければ、空室状況を確認いたします。",
  "宿泊予約をしたい": "ご予約をご希望ですね。ご宿泊日と人数をお伺いしてもよろしいでしょうか？",
  "予約の変更はできますか？": "はい、ご予約の変更は可能です。予約番号と変更内容をお知らせください。",
  "予約をキャンセルしたい": "キャンセルのご希望ですね。予約番号とご予約者様のお名前をお願いいたします。",
  "チェックインの時間は何時ですか？": "チェックインは15時から可能です。",
  "チェックアウトは何時ですか？": "チェックアウトは11時までとなっております。",
  "早めにチェックインできますか？": "お部屋の準備状況により、アーリーチェックインが可能な場合がございます。事前にお問い合わせください。",
  "レイトチェックアウトは可能ですか？": "レイトチェックアウトは追加料金にて承っております。空室状況によりお受けできない場合もございます。",
  "子どもは宿泊できますか？": "はい、お子様もご宿泊いただけます。3歳以下のお子様は添い寝で無料です。",
  "添い寝は可能ですか？": "はい、小学生未満のお子様は添い寝でご利用いただけます。",
  "ペットは同伴できますか？": "申し訳ございません。当ホテルではペットの同伴はご遠慮いただいております（補助犬は可）。",
  "駐車場はありますか？": "ホテル地下にご宿泊者専用駐車場がございます。1泊3,000円です。",
  "Wi-Fiは使えますか？": "はい、全客室およびロビーで無料Wi-Fiをご利用いただけます。",
  "朝食はありますか？": "はい、シャーウッドガーデン・レストランにてビュッフェ形式の朝食をご用意しております。",
  "レストランやカフェはありますか？": "はい、館内に複数のレストラン・カフェがございます。",
  "大浴場や温泉はありますか？": "当ホテルには温泉・大浴場の設備はございませんが、客室のバスルームをご利用いただけます。",
  "コインランドリーはありますか？": "はい、ホテル内にコインランドリーをご用意しております（24時間利用可）。",
  "アメニティは何がありますか？": "ディズニーデザインのシャンプーや歯ブラシ、パジャマなどをご用意しております。",
  "ルームサービスはありますか？": "現在ルームサービスは一部メニューのみご提供しております。詳細はお問合せください。",
  "荷物の預かりはできますか？": "はい、チェックイン前・チェックアウト後ともにフロントにてお預かり可能です。",
  "宅配便は利用できますか？": "はい、フロントにてヤマト運輸の宅配サービスをご利用いただけます。",
  "最寄り駅はどこですか？": "最寄り駅はディズニーリゾートラインの『東京ディズニーランド・ステーション』です。",
  "空港からのアクセスを教えてください": "成田・羽田空港からはリムジンバスまたは電車にてお越しいただけます。",
  "タクシーの手配はできますか？": "はい、フロントにて24時間タクシーの手配を承っております。",
  "周辺に観光地はありますか？": "はい、東京ディズニーランドおよびディズニーシーがすぐ近くにございます。",
  "コンビニは近くにありますか？": "ホテル館内にはございませんが、リゾート内にコンビニエンスストアがございます。",
  "駐車場の料金はいくらですか？": "ご宿泊者様は1泊3,000円でご利用いただけます。",
  "予約の確認をしたい": "予約の確認ですね。ご予約のお名前と予約番号をお伺いできますか？",
  "予約番号がわからないけど確認できますか？": "はい、ご予約者様のお名前とご連絡先を教えていただければお調べいたします。",
  "支払い方法を教えてください": "現金、各種クレジットカード、電子マネー（交通系含む）に対応しております。",
  "クレジットカードは使えますか？": "はい、主要なクレジットカードをご利用いただけます。",
  "領収書は発行できますか？": "はい、チェックアウト時に領収書の発行が可能です。",
  "GoToトラベル（または割引）は使えますか？": "現在GoToトラベルは一時停止中です。再開情報は公式サイトをご確認ください。",
  "忘れ物について問い合わせたい": "恐れ入ります。忘れ物のお問い合わせはフロントまたは代表番号にご連絡ください。",
  "部屋のタイプを教えてください": "スタンダード、スーペリア、キャラクタールームなど複数のタイプをご用意しております。",
  "喫煙・禁煙の部屋は選べますか？": "当ホテルは全館禁煙です。所定の喫煙スペースをご利用ください。",
  "団体予約はできますか？": "はい、10名様以上の団体予約も承っております。代表者様よりお問合せください。",
  "記念日用のサービスはありますか？": "はい、バースデープランなど記念日向けのオプションがございます。",
  "施設の混雑状況を知りたい": "申し訳ありませんが、混雑状況はお電話ではお答えしかねます。ご了承ください。"
};

// カテゴリー別の質問（検索用）
const hotelCategories = {
  "宿泊": [
    "空室状況を教えてください", "宿泊予約をしたい", "予約の変更はできますか？", 
    "予約をキャンセルしたい", "チェックインの時間は何時ですか？", "チェックアウトは何時ですか？", 
    "早めにチェックインできますか？", "レイトチェックアウトは可能ですか？", 
    "子どもは宿泊できますか？", "添い寝は可能ですか？", "ペットは同伴できますか？"
  ],
  "館内サービス": [
    "駐車場はありますか？", "Wi-Fiは使えますか？", "朝食はありますか？", 
    "レストランやカフェはありますか？", "大浴場や温泉はありますか？", 
    "コインランドリーはありますか？", "アメニティは何がありますか？", 
    "ルームサービスはありますか？", "荷物の預かりはできますか？", "宅配便は利用できますか？"
  ],
  "アクセス": [
    "最寄り駅はどこですか？", "空港からのアクセスを教えてください", 
    "タクシーの手配はできますか？", "周辺に観光地はありますか？", 
    "コンビニは近くにありますか？", "駐車場の料金はいくらですか？"
  ],
  "予約確認・支払い": [
    "予約の確認をしたい", "予約番号がわからないけど確認できますか？", 
    "支払い方法を教えてください", "クレジットカードは使えますか？", 
    "領収書は発行できますか？", "GoToトラベル（または割引）は使えますか？"
  ],
  "その他": [
    "忘れ物について問い合わせたい", "部屋のタイプを教えてください", 
    "喫煙・禁煙の部屋は選べますか？", "団体予約はできますか？", 
    "記念日用のサービスはありますか？", "施設の混雑状況を知りたい"
  ]
};

// 日本語と英語のフォールバック応答
const fallbackResponses = {
  ja: [
    "いらっしゃいませ。当旅館へのご関心をありがとうございます。",
    "チェックイン時間は午後3時からとなっております。",
    "朝食は朝7時から9時までご利用いただけます。",
    "ご不明な点がございましたら、どうぞお気軽にお尋ねください。",
    "お客様のご滞在が快適なものになりますよう、スタッフ一同心よりお待ちしております。",
    "当旅館の温泉は24時間ご利用いただけます。",
    "館内には和食レストランがございます。",
    "最寄りの駅からは送迎バスもご用意しております。",
    "Wi-Fiは全館無料でご利用いただけます。",
    "近隣の観光スポットについてもお気軽にお尋ねください。"
  ],
  en: [
    "Welcome to our ryokan. Thank you for your interest.",
    "Check-in time is from 3:00 PM.",
    "Breakfast is available from 7:00 AM to 9:00 AM.",
    "If you have any questions, please feel free to ask.",
    "Our staff is looking forward to making your stay comfortable.",
    "Our hot spring is available 24 hours a day.",
    "We have a Japanese restaurant in the building.",
    "We provide a shuttle service from the nearest station.",
    "Free Wi-Fi is available throughout the building.",
    "Please feel free to ask about nearby tourist attractions."
  ]
};

// Keep track of previously used fallback responses to avoid repetition
let usedFallbackIndices = {
  ja: new Set<number>(),
  en: new Set<number>()
};

// 質問にマッチする回答を検索する関数
function findBestAnswer(question: string): string | null {
  // 完全一致で検索
  if (hotelFAQ[question]) {
    return hotelFAQ[question];
  }
  
  // キーワードマッチを試行
  const keywords = [
    "予約", "チェックイン", "チェックアウト", "Wi-Fi", "朝食", "駐車場", 
    "アクセス", "部屋", "支払い", "子ども", "ペット", "温泉"
  ];
  
  for (const keyword of keywords) {
    if (question.includes(keyword)) {
      // キーワードを含むFAQ質問を検索
      for (const faqQuestion in hotelFAQ) {
        if (faqQuestion.includes(keyword)) {
          return hotelFAQ[faqQuestion];
        }
      }
    }
  }
  
  return null; // マッチなし
}

export const generateResponse = async (messages: Message[]) => {
  try {
    // 最新のユーザーメッセージを取得
    const userMessage = messages[messages.length - 1].content;
    
    // FAQ回答を確認
    const faqAnswer = findBestAnswer(userMessage);
    
    // FAQに一致する回答があれば、それを返す（APIキーがなくても）
    if (faqAnswer) {
      return faqAnswer;
    }
    
    // Check if we have a valid client
    if (!client) {
      // Return a fallback response based on the user input language
      const isEnglish = /[a-zA-Z]/.test(userMessage) && !/[あ-んア-ン]/.test(userMessage);
      const responseSet = isEnglish ? fallbackResponses.en : fallbackResponses.ja;
      const usedIndices = isEnglish ? usedFallbackIndices.en : usedFallbackIndices.ja;
      
      // Get all available indices that haven't been used recently
      const availableIndices = Array.from(
        { length: responseSet.length }, 
        (_, i) => i
      ).filter(i => !usedIndices.has(i));
      
      // If all responses have been used, reset the used set
      if (availableIndices.length === 0) {
        usedIndices.clear();
        availableIndices.push(...Array.from({ length: responseSet.length }, (_, i) => i));
      }
      
      // Select a random index from available indices
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      
      // Mark this index as used
      usedIndices.add(randomIndex);
      
      return responseSet[randomIndex];
    }

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `あなたは丁寧で礼儀正しいディズニーホテルのフロントAIです。
以下の情報を参考に、お客様の質問に日本語で的確に答えてください：

- チェックイン時間は15時からです。
- チェックアウトは11時までです。
- 駐車場は1泊3,000円です。
- Wi-Fiは全館無料です。
- ペットは同伴できません（補助犬を除く）。
- 全館禁煙です。
- 最寄り駅はディズニーリゾートラインの「東京ディズニーランド・ステーション」です。
- お客様に常に敬語を使い、丁寧に応対してください。
- 同じ質問に対して、同じ回答を繰り返さないでください。
- 予約確認には予約者名と予約番号が必要です。
- わからないことは正直に謝罪し、フロントに直接お問い合わせいただくようご案内してください。`
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
