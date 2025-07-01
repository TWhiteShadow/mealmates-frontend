import React from 'react';
import { XCircle } from 'lucide-react';
import {
  Notification,
  ReservationCancelledParams,
  NotificationAction,
} from '@/api/Notification';
import NotificationBase from './NotificationBase';

interface ReservationCancelledProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const ReservationCancelled: React.FC<ReservationCancelledProps> = ({
  notification,
  onClick,
  onActionClick,
}) => {
  const params = notification.content as ReservationCancelledParams;
  const isSeller = params.is_seller;
  const content = isSeller
    ? `La réservation de ${params.buyer_fullname} pour "${params.offer_name}" a été annulée.`
    : `Votre réservation pour "${params.offer_name}" a été annulée.`;

  const actions: NotificationAction[] = [
    {
      title: 'Voir la conversation',
      onClick: (_, params: Record<string, any>) => {
        return {
          type: 'navigate',
          path: `/app/messages?conversation=${params.conversation_id}`,
        };
      },
      variant: 'default',
      className: 'bg-purple-semi-dark hover:bg-purple-dark text-white border-purple-semi-dark',
    },
    {
      title: "Voir l'offre",
      onClick: (_, params: Record<string, any>) => {
        return { type: 'navigate', path: `/app/product/${params.offer_id}` };
      },
      variant: 'outline',
      className:
        'border-purple-semi-dark text-purple-semi-dark hover:bg-purple-semi-dark hover:text-white',
    },
  ];

  const icon = (
    <div className='h-10 w-10 rounded-full bg-red-100 flex items-center justify-center'>
      <XCircle className='h-5 w-5 text-red-600' />
    </div>
  );

  return (
    <NotificationBase
      icon={icon}
      title='Réservation annulée'
      content={content}
      createdAt={notification.createdAt}
      isRead={notification.isRead}
      actions={actions}
      badgeColor='bg-red-100 text-red-800'
      onClick={() => onClick(notification)}
      onActionClick={onActionClick}
    />
  );
};

export default ReservationCancelled;
