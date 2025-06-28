import React from 'react';
import { Notification, NotificationAction } from '@/api/Notification';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDonateProductMutation } from '@/api/Product';

import OfferExpiryWarning from '../Notifications/OfferExpiryWarning';
import OfferPurchaseRequest from '../Notifications/OfferPurchaseRequest';
import OfferSold from '../Notifications/OfferSold';
import ReservationRequest from '../Notifications/ReservationRequest';
import ReservationConfirmed from '../Notifications/ReservationConfirmed';
import ReservationCancelled from '../Notifications/ReservationCancelled';
import ReservationExpired from '../Notifications/ReservationExpired';
import TransactionCompleted from '../Notifications/TransactionCompleted';
import TransactionQrValidated from '../Notifications/TransactionQrValidated';
import TransactionPaid from '../Notifications/TransactionPaid';
import ReviewReminder from '../Notifications/ReviewReminder';

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const navigate = useNavigate();
  const donateProductMutation = useDonateProductMutation();

  const handleActionClick = (e: React.MouseEvent, action: NotificationAction) => {
    e.stopPropagation();
    if (!notification.isRead) {
      onClick(notification);
    }

    const result = action.onClick(e, {
      ...notification.content,
      donateProduct: (productId: number) => {
        donateProductMutation.mutate(productId, {
          onSuccess: () => {
            console.log('Produit transformé en don avec succès');
          },
          onError: (error) => {
            console.error('Erreur lors de la transformation en don:', error);
          }
        });
      }
    });

    if (result && result.type === 'navigate' && result.path) {
      navigate(result.path);
    }
  };

  const renderNotification = () => {
    switch (notification.type) {
      case 'offer_expiry_warning':
        return (
          <OfferExpiryWarning 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
            donateProduct={(productId: number) => donateProductMutation.mutate(productId)}
          />
        );
      
      case 'offer_purchase_request':
        return (
          <OfferPurchaseRequest 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
          />
        );
      
      case 'offer_sold':
        return (
          <OfferSold 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
          />
        );
      
      case 'reservation_request':
        return (
          <ReservationRequest 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
          />
        );
      
      case 'reservation_confirmed':
        return (
          <ReservationConfirmed 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
          />
        );
      
      case 'reservation_cancelled':
        return (
          <ReservationCancelled 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
          />
        );
      
      case 'reservation_expired':
        return (
          <ReservationExpired 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
          />
        );
      
      case 'transaction_completed':
        return (
          <TransactionCompleted 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
          />
        );

      case 'transaction_paid':
        return (
          <TransactionPaid 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
          />
        );

      case 'transaction_qr_validated':
        return (
          <TransactionQrValidated 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
          />
        );

      case 'review_reminder':
        return (
          <ReviewReminder 
            notification={notification}
            onClick={onClick}
            onActionClick={handleActionClick}
          />
        );

      default:
        // Notification générique pour les types non gérés
        return (
          <div className="p-4 border-b cursor-pointer hover:bg-gray-50" onClick={() => onClick(notification)}>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Nouvelle notification</h3>
                <p className="text-sm text-gray-600">Vous avez une nouvelle notification.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderNotification();
};

export default NotificationItem;
