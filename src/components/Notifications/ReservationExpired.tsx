import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Notification, ReservationExpiredParams, NotificationAction } from '@/api/Notification';
import NotificationBase from './NotificationBase';

interface ReservationExpiredProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const ReservationExpired: React.FC<ReservationExpiredProps> = ({ 
  notification, 
  onClick, 
  onActionClick 
}) => {
  const params = notification.content as ReservationExpiredParams;
  
  const content = `Votre réservation pour "${params.offer_name}" a expiré. L'offre est à nouveau disponible.`;
  
  const actions: NotificationAction[] = [
    {
      title: 'Réserver à nouveau',
      onClick: (_, params: Record<string, any>) => {
        return { type: 'navigate', path: `/app/product/${params.offer_id}` };
      },
      variant: 'outline',
      className: "border-purple-semi-dark text-purple-semi-dark hover:bg-purple-semi-dark hover:text-white"
    }
  ];

  const icon = (
    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
      <AlertTriangle className="h-5 w-5 text-gray-600" />
    </div>
  );

  return (
    <NotificationBase
      icon={icon}
      title="Réservation expirée"
      content={content}
      createdAt={notification.createdAt}
      isRead={notification.isRead}
      actions={actions}
      badgeColor="bg-gray-100 text-gray-800"
      onClick={() => onClick(notification)}
      onActionClick={onActionClick}
    />
  );
};

export default ReservationExpired;
