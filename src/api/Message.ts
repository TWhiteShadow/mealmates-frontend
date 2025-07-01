import api from './Axios';
import { useQuery } from '@tanstack/react-query';
import { Product } from './Product';
import { User } from './User';

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
  offer: Product;
  buyer: User;
  seller: User;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationPreview {
  id: number;
  offer: Product;
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
  const response = await api.get(
    `/conversations/offer/${offerId}/with/${userId}`
  );
  return response.data;
};

export const getPredefinedMessages = async (): Promise<string[]> => {
  const response = await api.get('/messages/predefined');
  return response.data;
};

export const getUnreadMessagesCount = async (): Promise<number> => {
  const response = await api.get('/messages/unread-count');
  return response.data.count;
};

export const useConversations = () => {
  return useQuery<ConversationPreview[]>({
    queryKey: ['conversations'],
    queryFn: getConversations,

    refetchInterval:
      Number(import.meta.env.VITE_CONVERSATIONS_POLL_INTERVAL) || 60000,
  });
};
