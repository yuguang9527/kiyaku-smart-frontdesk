
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ChatBubble from './ChatBubble';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatInterfaceProps {
  title: string;
  hotelInfo?: {
    name: string;
    greeting: string;
  };
}

const formatTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  title,
  hotelInfo = { name: 'さくらリヤカン', greeting: 'いらっしゃいませ。ご質問があればお気軽にどうぞ。' }
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: hotelInfo.greeting,
      isUser: false,
      timestamp: formatTime()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();

  // Simple responses for demo purposes
  const responses = {
    'チェックイン': 'チェックインは15時からとなっております。お早めにお越しの場合は荷物のお預かりも可能です。',
    'チェックアウト': 'チェックアウトは10時でございます。レイトチェックアウトをご希望の場合は、フロントまでお知らせください。',
    '朝食': '朝食は7時から9時まで1階レストランでご用意しております。和食と洋食からお選びいただけます。',
    '駐車場': '当館には無料駐車場がございます。到着時にフロントへ車のナンバーをお伝えください。',
    'Wi-Fi': '館内全域でWi-Fiをご利用いただけます。接続情報はお部屋に表示されています。',
    'check-in': 'Check-in starts from 3:00 PM. We can store your luggage if you arrive earlier.',
    'check-out': 'Check-out time is 10:00 AM. Please let us know if you need a late check-out.',
    'breakfast': 'Breakfast is served at our restaurant on the first floor from 7:00 AM to 9:00 AM.',
    'parking': 'We offer a free parking lot for our guests. Please provide your vehicle information at the front desk.',
    'wi-fi': 'Wi-Fi is available throughout the building. Connection details are displayed in your room.'
  };

  const generateResponse = (text: string) => {
    // For demo purposes, check if the message includes certain keywords
    const normalizedText = text.toLowerCase();
    
    let responseText = '';
    for (const [keyword, response] of Object.entries(responses)) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        responseText = response;
        break;
      }
    }
    
    // Default response if no keywords match
    if (!responseText) {
      responseText = 'ありがとうございます。他にご質問はございますか？';
      if (/[a-zA-Z]/.test(text)) {
        responseText = 'Thank you for your message. Is there anything else I can help you with?';
      }
    }
    
    return responseText;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: formatTime()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputMessage),
        isUser: false,
        timestamp: formatTime()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-3 border-b bg-muted/30">
        <h3 className="font-medium">{title}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
