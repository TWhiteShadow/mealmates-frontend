import api from './Axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Offer {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface Message {
  id: number;
  content: string | null;
  createdAt: string;
  isRead: boolean;
  images?: { name: string }[];
  sender: User;
}

export interface Conversation {
  id: number;
  offer: Offer;
  buyer: User;
  seller: User;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationPreview {
  id: number;
  offer: Offer;
  buyer: User;
  seller: User;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export const getConversations = async (): Promise<ConversationPreview[]> => {
  const response = await api.get(`/conversations`);
  return response.data;
};

export const getConversationMessages = async (
  id: number,
  limit: number = 150,
  offset: number = 0
): Promise<Message[]> => {
  const response = await api.get(
    `/conversations/${id}/messages?limit=${limit}&offset=${offset}`
  );
  return response.data;
};

export const sendMessage = async (
  conversationId: number,
  content: string,
  images?: File[]
): Promise<Message> => {
  const formData = new FormData();

  if (content) {
    formData.append('content', content);
  }

  if (images && images.length > 0) {
    // Append each image with array notation for multiple files
    images.forEach((image) => {
      formData.append('images[]', image);
    });
  }

  const response = await api.post(
    `/conversations/${conversationId}/messages`,
    formData
  );
  return response.data;
};

export const getOrCreateConversation = async (
  offerId: number,
  userId: number
): Promise<Conversation> => {
  const response = await fetch(
    `${API_URL}/api/v1/conversations/offer/${offerId}/with/${userId}`,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }

  return response.json();
};

export const getPredefinedMessages = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/api/v1/messages/predefined`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch predefined messages');
  }

  return response.json();
};

export const getUnreadMessagesCount = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/api/v1/messages/unread-count`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch unread messages count');
  }

  const data = await response.json();
  return data.count;
};
