import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Notification, ReservationRequestParams, NotificationAction } from '@/api/Notification';
import NotificationBase from './NotificationBase';

interface ReservationRequestProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const ReservationRequest: React.FC<ReservationRequestProps> = ({ notification, onClick, onActionClick }) => {
  const params = notification.content as ReservationRequestParams;
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Convertir en UTC+2
  useEffect(() => {
    if (params.reservation_expires_at) {
      const updateTimeLeft = () => {
        // Convertir la date en UTC+2 (appliquer +2 heures)
        const expiresAtUTC = new Date(params.reservation_expires_at);
        const expiresAtLocal = new Date(expiresAtUTC.getTime() + 2 * 60 * 60 * 1000); // +2 heures
        
        const now = new Date().getTime();
        const difference = expiresAtLocal.getTime() - now;

        if (difference <= 0) {
          setTimeLeft(0);
        } else {
          setTimeLeft(Math.ceil(difference / 1000));
        }
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);

      return () => clearInterval(interval);
    }
  }, [params.reservation_expires_at]);

  const hasExpired = timeLeft === 0;
  const baseMessage = `${params.buyer_fullname} souhaite réserver votre offre "${params.offer_name}".`;
  const content = hasExpired 
    ? `${baseMessage} Cette réservation a expiré.` 
    : baseMessage;

  const actions: NotificationAction[] = hasExpired
    ? [
        {
          title: 'Voir détails',
          onClick: (_, params: Record<string, any>) => {
            return { type: 'navigate', path: `/transaction/${params.transaction_id}` };
          },
          variant: 'outline',
          className: "border-purple-semi-dark text-purple-semi-dark hover:bg-purple-semi-dark hover:text-white"
        }
      ]
    : [
        {
          title: 'Confirmer',
          onClick: (_, params: Record<string, any>) => {
            return { type: 'navigate', path: `/reservations/${params.transaction_id}/confirm` };
          },
          variant: 'default',
          className: "bg-purple-semi-dark hover:bg-purple-dark text-white border-purple-semi-dark"
        },
        {
          title: 'Voir détails',
          onClick: (_, params: Record<string, any>) => {
            return { type: 'navigate', path: `/transaction/${params.transaction_id}` };
          },
          variant: 'outline',
          className: "border-purple-semi-dark text-purple-semi-dark hover:bg-purple-semi-dark hover:text-white"
        }
      ];

  const icon = (
    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
      <Clock className="h-5 w-5 text-orange-600" />
    </div>
  );

  return (
    <NotificationBase
      icon={icon}
      title="Demande de réservation"
      content={content}
      createdAt={notification.createdAt}
      isRead={notification.isRead}
      actions={actions}
      badgeColor="bg-orange-100 text-orange-800"
      timeLeft={!hasExpired ? timeLeft : null}
      onClick={() => onClick(notification)}
      onActionClick={onActionClick}
    />
  );
};

export default ReservationRequest;
