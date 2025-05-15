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
  sentAt: string;
  isRead: boolean;
  imageFilename: string | null;
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
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export const getConversations = async (): Promise<ConversationPreview[]> => {
  const response = await fetch(`${API_URL}/api/v1/conversations`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }

  return response.json();
};

export const getConversation = async (id: number): Promise<Conversation> => {
  const response = await fetch(
    `${API_URL}/api/v1/conversations/${id}/messages`,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }

  return response.json();
};

export const markConversationAsRead = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/v1/conversations/${id}/read`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark conversation as read');
  }
};

export const sendMessage = async (
  conversationId: number,
  content: string,
  image?: File
): Promise<Message> => {
  const formData = new FormData();

  if (content) {
    formData.append('content', content);
  }

  if (image) {
    formData.append('image', image);
  }

  const response = await fetch(
    `${API_URL}/api/v1/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
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
