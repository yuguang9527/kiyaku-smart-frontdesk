const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async register(email: string, password: string, name: string, role = 'CUSTOMER') {
    const response = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  // Reservation endpoints
  async getReservations(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/reservations${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.request<any>(endpoint);
  }

  async getReservation(id: string) {
    return this.request<any>(`/reservations/${id}`);
  }

  async createReservation(reservation: any) {
    return this.request<any>('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservation),
    });
  }

  async updateReservation(id: string, reservation: any) {
    return this.request<any>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservation),
    });
  }

  async deleteReservation(id: string) {
    return this.request<any>(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  // Hotel endpoints
  async getHotels() {
    return this.request<any>('/hotels');
  }

  async getHotel(id: string) {
    return this.request<any>(`/hotels/${id}`);
  }

  async updateHotel(id: string, hotel: any) {
    return this.request<any>(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hotel),
    });
  }

  // Chat endpoints
  async sendChatMessage(message: string, sessionId: string, userId?: string, hotelId?: string) {
    return this.request<any>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId, userId, hotelId }),
    });
  }

  async getChatHistory(sessionId: string, limit = 50) {
    return this.request<any>(`/chat/history/${sessionId}?limit=${limit}`);
  }

  // Twilio endpoints
  async initiateCall(to: string, from?: string) {
    return this.request<any>('/twilio/call', {
      method: 'POST',
      body: JSON.stringify({ to, from }),
    });
  }

  async getCalls() {
    return this.request<any>('/twilio/calls');
  }

  // Q&A endpoints
  async getQAItems(params?: {
    hotelId?: string;
    language?: string;
    category?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });
    }

    const endpoint = `/qa${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.request<any>(endpoint);
  }

  async createQAItem(qaItem: any) {
    return this.request<any>('/qa', {
      method: 'POST',
      body: JSON.stringify(qaItem),
    });
  }

  async updateQAItem(id: string, qaItem: any) {
    return this.request<any>(`/qa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(qaItem),
    });
  }

  async deleteQAItem(id: string) {
    return this.request<any>(`/qa/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();