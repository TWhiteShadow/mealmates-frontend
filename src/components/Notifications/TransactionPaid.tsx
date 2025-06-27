import React from 'react';
import { BadgeEuro } from 'lucide-react';
import { Notification, TransactionPaidParams, NotificationAction } from '@/api/Notification';
import NotificationBase from './NotificationBase';

interface TransactionPaidProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const TransactionPaid: React.FC<TransactionPaidProps> = ({ 
  notification, 
  onClick, 
  onActionClick 
}) => {
  const params = notification.content as TransactionPaidParams;
  
  const baseMessage = `La transaction pour "${params.offer_name}" a été prépayée`;
  const isSeller = params.is_seller;
  const content = isSeller 
    ? `${baseMessage} par ${params.buyer_fullname} ${params.amount > 0 ? `Montant: ${params.amount}€` : ''}`
    : `${baseMessage}. Vous pouvez maintenant organiser la rencontre.`;
  
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
    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
      <BadgeEuro className="h-5 w-5 text-purple-semi-dark" />
    </div>
  );

  return (
    <NotificationBase
      icon={icon}
      title="Transaction payée"
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

export default TransactionPaid;
