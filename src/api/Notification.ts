import api from './Axios';

export interface Notification {
  id: number;
  type: string;
  content: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  user?: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
}

export type NotificationType = 
  | 'offer_expiry_warning'
  | 'offer_purchase_request'
  | 'offer_sold'
  | 'reservation_request'
  | 'reservation_confirmed'
  | 'reservation_cancelled'
  | 'reservation_expired'
  | 'transaction_completed'
  | 'transaction_paid'
  | 'transaction_qr_validated'
  | 'review_reminder'
  | 'new_message';

export interface NotificationParams {
  [key: string]: any;
}

// Interface pour les actions des notifications
export interface NotificationAction {
  title: string;
  onClick: (e: React.MouseEvent, params: Record<string, any>) => NotificationActionResult | void;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary';
  className?: string;
}

export interface NotificationActionResult {
  type: 'navigate'|'custom';
  path: string;
}

// Interfaces pour chaque type de notification
export interface OfferExpiryWarningParams extends NotificationParams {
  offer_id: number;
  offer_name: string;
  days_until_expiry: number;
}

export interface OfferPurchaseRequestParams extends NotificationParams {
  offer_id: number;
  offer_name: string;
  buyer_id: number;
  buyer_fullname: string;
}

export interface OfferSoldParams extends NotificationParams {
  conversation_id: number|null;
  offer_id: number;
  offer_name: string;
  buyer_id: number;
  buyer_fullname: string;
  price: number;
  transaction_id: number;
}

export interface ReservationRequestParams extends NotificationParams {
  transaction_id: number;
  conversation_id: number|null;
  offer_id: number;
  offer_name: string;
  buyer_id: number;
  buyer_fullname: string;
  reservation_expires_at: string; // Date ISO
}

export interface ReservationConfirmedParams extends NotificationParams {
  transaction_id: number;
  offer_id: number;
  offer_name: string;
  seller_id: number;
  seller_fullname: string;
  is_free_offer: boolean;
}

export interface ReservationCancelledParams extends NotificationParams {
  offer_id: number;
  offer_name: string;
  buyer_id: number;
  buyer_fullname: string;
  is_seller?: boolean;
}

export interface ReservationExpiredParams extends NotificationParams {
  offer_id: number;
  offer_name: string;
}

export interface TransactionCompletedParams extends NotificationParams {
  transaction_id: number;
  offer_name: string;
  amount: number;
}

export interface TransactionPaidParams extends NotificationParams {
  transaction_id: number;
  conversation_id: number|null;
  offer_id: number;
  offer_name: string;
  is_seller?: boolean;
  buyer_fullname?: string;
}

export interface TransactionQrValidatedParams extends NotificationParams {
  transaction_id: number;
  offer_name: string;
  buyer_fullname: string;
}

export interface ReviewReminderParams extends NotificationParams {
  transaction_id: number;
  offer_id: number;
  offer_name: string;
  seller_id?: number;
  seller_firstname?: string;
  seller_lastname?: string;
  buyer_id?: number;
  buyer_firstname?: string;
  buyer_lastname?: string;
  completed_at: string;
}

export interface NewMessageParams extends NotificationParams {
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  preview?: string;
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
