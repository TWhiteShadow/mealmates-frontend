import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Notification, TransactionCompletedParams, NotificationAction } from '@/api/Notification';
import NotificationBase from './NotificationBase';

interface TransactionCompletedProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const TransactionCompleted: React.FC<TransactionCompletedProps> = ({ 
  notification, 
  onClick, 
  onActionClick 
}) => {
  const params = notification.content as TransactionCompletedParams;
  
  const baseMessage = `La transaction pour "${params.offer_name}" est terminée`;
  const content = params.amount > 0 
    ? `${baseMessage}. Montant: ${params.amount}€`
    : `${baseMessage}.`;
  
  const actions: NotificationAction[] = [
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
    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
      <CheckCircle className="h-5 w-5 text-purple-semi-dark" />
    </div>
  );

  return (
    <NotificationBase
      icon={icon}
      title="Transaction terminée"
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

export default TransactionCompleted;
