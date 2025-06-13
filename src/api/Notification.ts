import api from './Axios';

export interface Notification {
  id: number;
  type: string;
  content: {
    message?: string;
    offerId?: number;
    offer_id?: number;
    offer_name?: string;
    quantity?: number;
    price?: number;
    days_until_expiry?: number;
    buyer_id?: number;
    buyer_fullname?: string;
    sale_date?: string;
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: string;
  user?: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  await api.patch(`/notifications/${id}/mark-as-read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch('/notifications/mark-all-as-read');
};

export const getUnreadNotificationsCount = async (): Promise<number> => {
  const response = await api.get('/notifications/unread-count');
  return response.data.count;
};