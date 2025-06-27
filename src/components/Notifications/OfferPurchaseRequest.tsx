import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Notification, OfferPurchaseRequestParams, NotificationAction } from '@/api/Notification';
import NotificationBase from './NotificationBase';

interface OfferPurchaseRequestProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const OfferPurchaseRequest: React.FC<OfferPurchaseRequestProps> = ({ 
  notification, 
  onClick, 
  onActionClick 
}) => {
  const params = notification.content as OfferPurchaseRequestParams;
  
  const content = `${params.buyer_fullname} souhaite acheter votre offre "${params.offer_name}".`;
  
  const actions: NotificationAction[] = [
    {
      title: "Voir l'offre",
      onClick: (_, params: Record<string, any>) => {
        return { type: 'navigate', path: `/app/product/${params.offer_id}` };
      },
      variant: 'outline',
      className: "border-purple-semi-dark text-purple-semi-dark hover:bg-purple-semi-dark hover:text-white"
    }
  ];

  const icon = (
    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
      <ShoppingCart className="h-5 w-5 text-blue-600" />
    </div>
  );

  return (
    <NotificationBase
      icon={icon}
      title="Nouvelle demande d'achat"
      content={content}
      createdAt={notification.createdAt}
      isRead={notification.isRead}
      actions={actions}
      badgeColor="bg-blue-100 text-blue-800"
      onClick={() => onClick(notification)}
      onActionClick={onActionClick}
    />
  );
};

export default OfferPurchaseRequest;
