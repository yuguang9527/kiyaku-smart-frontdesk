
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface HotelInfoProps {
  name: string;
  greeting: string;
}

export interface ChatInterfaceProps {
  title?: string;
  hotelInfo?: HotelInfoProps;
}
