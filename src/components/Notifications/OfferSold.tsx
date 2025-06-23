import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Notification, OfferSoldParams, NotificationAction } from '@/api/Notification';
import NotificationBase from './NotificationBase';

interface OfferSoldProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const OfferSold: React.FC<OfferSoldProps> = ({ 
  notification, 
  onClick, 
  onActionClick 
}) => {
  const params = notification.content as OfferSoldParams;
  
  const content = `Votre offre "${params.offer_name}" a été vendue à ${params.buyer_fullname} pour ${params.price}€.`;
  
  const actions: NotificationAction[] = [
    {
      title: 'Voir les détails',
      onClick: (_, params: Record<string, any>) => {
        return { type: 'navigate', path: `/transaction/${params.transaction_id || 'sold'}` };
      },
      variant: 'outline',
      className: "border-purple-semi-dark text-purple-semi-dark hover:bg-purple-semi-dark hover:text-white"
    }
  ];

  const icon = (
    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
      <CheckCircle className="h-5 w-5 text-purple-semi-dark" />
    </div>
  );

  return (
    <NotificationBase
      icon={icon}
      title="Offre vendue"
      content={content}
      createdAt={notification.createdAt}
      isRead={notification.isRead}
      actions={actions}
      badgeColor="bg-purple-50 text-purple-semi-dark"
      onClick={() => onClick(notification)}
      onActionClick={onActionClick}
    />
  );
};

export default OfferSold;
