
export interface ChatHistoryEntry {
  id: string;
  reservationNumber: string;
  messages: Array<{
    id: string;
    content: string;
    isUser: boolean;
    timestamp: string;
  }>;
  lastUpdated: string;
}

class ChatHistoryService {
  private storageKey = 'hotel_chat_history';

  // Get chat history for a specific reservation number
  getChatHistory(reservationNumber: string): ChatHistoryEntry | null {
    try {
      const allHistory = this.getAllHistory();
      return allHistory.find(entry => entry.reservationNumber === reservationNumber) || null;
    } catch (error) {
      console.error('Error getting chat history:', error);
      return null;
    }
  }

  // Save chat history for a reservation number
  saveChatHistory(reservationNumber: string, messages: ChatHistoryEntry['messages']): void {
    try {
      const allHistory = this.getAllHistory();
      const existingIndex = allHistory.findIndex(entry => entry.reservationNumber === reservationNumber);
      
      const historyEntry: ChatHistoryEntry = {
        id: existingIndex >= 0 ? allHistory[existingIndex].id : `history_${Date.now()}`,
        reservationNumber,
        messages,
        lastUpdated: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        allHistory[existingIndex] = historyEntry;
      } else {
        allHistory.push(historyEntry);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(allHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  // Get all chat history entries
  private getAllHistory(): ChatHistoryEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing chat history:', error);
      return [];
    }
  }

  // Clear history for a specific reservation (optional utility)
  clearChatHistory(reservationNumber: string): void {
    try {
      const allHistory = this.getAllHistory();
      const filteredHistory = allHistory.filter(entry => entry.reservationNumber !== reservationNumber);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }
}

export const chatHistoryService = new ChatHistoryService();
