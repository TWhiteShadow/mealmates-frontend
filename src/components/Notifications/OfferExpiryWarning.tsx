import React from 'react';
import { CircleAlert } from 'lucide-react';
import { Notification, OfferExpiryWarningParams, NotificationAction } from '@/api/Notification';
import NotificationBase from './NotificationBase';

interface OfferExpiryWarningProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
  donateProduct?: (productId: number) => void;
}

const OfferExpiryWarning: React.FC<OfferExpiryWarningProps> = ({ 
  notification, 
  onClick, 
  onActionClick,
  donateProduct 
}) => {
  const params = notification.content as OfferExpiryWarningParams;
  
  const content = `Votre offre "${params.offer_name}" expire dans ${params.days_until_expiry} jour(s).`;
  
  const actions: NotificationAction[] = [
    {
      title: "Modifier l'offre",
      onClick: (_, params: Record<string, any>) => {
        return { type: 'navigate', path: `/app/product/${params.offer_id}/edit` };
      },
      variant: 'outline',
      className: "border-purple-semi-dark text-purple-semi-dark hover:bg-purple-semi-dark hover:text-white"
    },
    {
      title: 'Transformer en don',
      onClick: (_, params: Record<string, any>) => {
        if (donateProduct) {
          donateProduct(parseInt(params.offer_id));
        }
        return;
      },
      variant: 'outline',
      className: "border-purple-semi-dark text-purple-semi-dark hover:bg-purple-semi-dark hover:text-white"
    }
  ];

  const icon = (
    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
      <CircleAlert className="h-5 w-5 text-yellow-600" />
    </div>
  );

  return (
    <NotificationBase
      icon={icon}
      title="Offre proche de l'expiration"
      content={content}
      createdAt={notification.createdAt}
      isRead={notification.isRead}
      actions={actions}
      badgeColor="bg-yellow-100 text-yellow-800"
      onClick={() => onClick(notification)}
      onActionClick={onActionClick}
    />
  );
};

export default OfferExpiryWarning;
