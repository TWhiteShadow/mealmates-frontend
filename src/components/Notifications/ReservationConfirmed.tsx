import React from 'react';
import { UserCheck } from 'lucide-react';
import { Notification, ReservationConfirmedParams, NotificationAction } from '@/api/Notification';
import NotificationBase from './NotificationBase';

interface ReservationConfirmedProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const ReservationConfirmed: React.FC<ReservationConfirmedProps> = ({
  notification,
  onClick,
  onActionClick
}) => {
  const params = notification.content as ReservationConfirmedParams;

  const baseMessage = `Votre réservation pour "${params.offer_name}" a été confirmée par ${params.seller_fullname}`; // reminder: fullname contains a dot at the end
  const content = params.is_free_offer
    ? `${baseMessage} Vous pouvez maintenant organiser la rencontre.`
    : `${baseMessage} Vous devez maintenant effectuer le paiement.`;

  const actions: NotificationAction[] = [];

  if (!params.is_free_offer) {
    actions.push({
      title: 'Payer maintenant',
      onClick: (_, params: Record<string, any>) => {
        return { type: 'navigate', path: `/app/messages?conversation=${params.conversation_id}` };
      },
      variant: 'default',
      className: "bg-purple-semi-dark hover:bg-purple-dark text-white border-purple-semi-dark"
    });
  }

  actions.push({
    title: 'Voir la conversation',
    onClick: (_, params: Record<string, any>) => {
      return { type: 'navigate', path: `/app/messages?conversation=${params.conversation_id}` };
    },
    variant: !params.is_free_offer ? 'outline' : 'default',
    className: !params.is_free_offer
      ? "border-purple-semi-dark text-purple-semi-dark hover:bg-purple-semi-dark hover:text-white"
      : "bg-purple-semi-dark hover:bg-purple-dark text-white border-purple-semi-dark"
  });

  const icon = (
    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
      <UserCheck className="h-5 w-5 text-purple-semi-dark" />
    </div>
  );

  return (
    <NotificationBase
      icon={icon}
      title="Réservation confirmée"
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

export default ReservationConfirmed;
