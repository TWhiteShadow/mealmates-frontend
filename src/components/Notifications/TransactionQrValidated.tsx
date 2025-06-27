import React from 'react';
import { QrCode } from 'lucide-react';
import { Notification, TransactionQrValidatedParams, NotificationAction } from '@/api/Notification';
import NotificationBase from './NotificationBase';

interface TransactionQrValidatedProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const TransactionQrValidated: React.FC<TransactionQrValidatedProps> = ({ 
  notification, 
  onClick, 
  onActionClick 
}) => {
  const params = notification.content as TransactionQrValidatedParams;
  
  const content = `${params.buyer_fullname} a présenté le QR code pour "${params.offer_name}". Vous pouvez finaliser la remise.`;
  
  const actions: NotificationAction[] = [
    {
      title: 'Finaliser la remise',
      onClick: (_, params: Record<string, any>) => {
        return { type: 'navigate', path: `/transaction/${params.transaction_id}/validate` };
      },
      variant: 'default',
      className: "bg-purple-semi-dark hover:bg-purple-dark text-white border-purple-semi-dark"
    }
  ];

  const icon = (
    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
      <QrCode className="h-5 w-5 text-purple-600" />
    </div>
  );

  return (
    <NotificationBase
      icon={icon}
      title="QR Code scanné"
      content={content}
      createdAt={notification.createdAt}
      isRead={notification.isRead}
      actions={actions}
      badgeColor="bg-purple-100 text-purple-800"
      onClick={() => onClick(notification)}
      onActionClick={onActionClick}
    />
  );
};

export default TransactionQrValidated;
