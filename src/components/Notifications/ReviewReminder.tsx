import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Notification, ReviewReminderParams, NotificationAction } from '@/api/Notification';
import NotificationBase from './NotificationBase';
import ReviewDialog from '@/components/ReviewDialog';

interface ReviewReminderProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const ReviewReminder: React.FC<ReviewReminderProps> = ({ 
  notification, 
  onClick, 
  onActionClick 
}) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const params = notification.content as ReviewReminderParams;
  
  const isBuyer = params.seller_id ? true : false;

  const otherParticipantName = isBuyer ? `${params.seller_firstname} ${params.seller_lastname}` : `${params.buyer_firstname} ${params.buyer_lastname}`;
  
  const content = `Donnez votre avis sur votre transaction avec ${otherParticipantName} pour "${params.offer_name}".`;
  
  const handleOpenReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      onClick(notification);
    }
    setIsReviewDialogOpen(true);
  };

  const actions: NotificationAction[] = [
    {
      title: 'Donner mon avis',
      onClick: handleOpenReview,
      variant: 'default',
      className: "bg-purple-semi-dark text-white hover:bg-purple-dark"
    }
  ];

  const icon = (
    <div className="h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center">
      <Star className="h-5 w-5 text-yellow-500" />
    </div>
  );

  return (
    <>
      <NotificationBase
        icon={icon}
        title="Avis demandé"
        content={content}
        createdAt={notification.createdAt}
        isRead={notification.isRead}
        actions={actions}
        badgeColor="bg-yellow-50 text-yellow-600"
        onClick={() => onClick(notification)}
        onActionClick={onActionClick}
      />
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        transactionId={params.transaction_id}
        product={{
          id: params.offer_id,
          name: params.offer_name
        } as any}
        otherParticipant={{
          id: isBuyer ? params.seller_id : params.buyer_id,
          first_name: isBuyer ? params.seller_firstname : params.buyer_firstname,
          last_name: isBuyer ? params.seller_lastname : params.buyer_lastname,
        } as any}
        isBuyer={isBuyer}
      />
    </>
  );
};

export default ReviewReminder;
