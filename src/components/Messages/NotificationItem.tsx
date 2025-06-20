import React from 'react';
import { Notification } from '@/api/Notification';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { Bell, Check, CircleAlert, MessageSquare, ShoppingCart } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useDonateProductMutation } from '@/api/Product';

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

interface NotificationActionResult {
  type: 'navigate';
  path: string;
}

interface NotificationAction {
  title: string;
  onClick: (e: React.MouseEvent, params: Record<string, any>) => NotificationActionResult | void;
  variant?: 'default' | 'outline';
  className?: string;
}

const notificationHandlers: Record<string, {
  getTitle: () => string;
  getContent: (params: Record<string, any>) => string;
  getIcon: () => React.ReactNode;
  getActions: (params: Record<string, any>) => NotificationAction[];
}> = {
  'offer_expiry_warning': {
    getTitle: () => 'Offre proche de l\'expiration',
    getContent: (params) => `Votre offre "${params.offer_name}" expire dans ${params.days_until_expiry} jours.`,
    getIcon: () => (
      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
        <CircleAlert className="text-yellow-500" />
      </div>
    ),
    getActions: () => [
      {
        title: 'Modifier l\'offre',
        onClick: (e, params) => {
          e.stopPropagation();
          return { type: 'navigate', path: `/sell/edit/${params.offerId || params.offer_id}` };
        },
        variant: 'outline',
        className: "bg-purple-dark text-white hover:bg-purple-dark/80 hover:text-white"
      },
      {
        title: 'Donner le produit',
        onClick: (e, params) => {
          e.stopPropagation();
          if (params.donateProduct) {
            const productId = params.offer_id;
            if (productId) {
              params.donateProduct(parseInt(productId, 10));
            }
          }
        },
        variant: 'outline',
      }
    ]
  },
  'offer_purchase_request': {
    getTitle: () => 'Nouvelle demande d\'achat',
    getContent: (params) => `${params.buyer_fullname} souhaite acheter votre offre "${params.offer_name}".`,
    getIcon: () => (
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
        <ShoppingCart className="text-blue-500" />
      </div>
    ),
    getActions: () => []
  },
  'offer_sold': {
    getTitle: () => 'Offre vendue',
    getContent: (params) => `Votre offre "${params.offer_name}" a été vendue à ${params.buyer_fullname}.`,
    getIcon: () => (
      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="text-green-500" />
      </div>
    ),
    getActions: () => []
  },
  'reservation_request': {
    getTitle: () => 'Nouvelle demande de réservation',
    getContent: (params) => `${params.buyer_fullname} souhaite réserver votre offre "${params.offer_name}".`,
    getIcon: () => (
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
        <ShoppingCart className="text-blue-500" />
      </div>
    ),
    getActions: () => [
      {
        title: 'Confirmer la réservation',
        onClick: (e, params) => {
          e.stopPropagation();
          return { type: 'navigate', path: `/messages?transaction=${params.transaction_id}` };
        },
        className: "bg-purple-dark text-white hover:bg-purple-dark/80 hover:text-white"
      },
      {
        title: 'Voir les détails',
        onClick: (e, params) => {
          e.stopPropagation();
          return { type: 'navigate', path: `/messages` };
        },
        variant: 'outline',
      }
    ]
  },
  'reservation_confirmed': {
    getTitle: () => 'Réservation confirmée',
    getContent: (params) => `${params.seller_fullname} a confirmé votre réservation de "${params.offer_name}".${params.is_free_offer ? ' Offre gratuite acquise!' : ' Vous pouvez maintenant procéder au paiement.'}`,
    getIcon: () => (
      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="text-green-500" />
      </div>
    ),
    getActions: (params) => [
      {
        title: params.is_free_offer ? 'Voir les détails' : 'Procéder au paiement',
        onClick: (e, params) => {
          e.stopPropagation();
          return { type: 'navigate', path: `/messages?transaction=${params.transaction_id}` };
        },
        className: "bg-purple-dark text-white hover:bg-purple-dark/80 hover:text-white"
      }
    ]
  },
  'reservation_cancelled': {
    getTitle: () => 'Réservation annulée',
    getContent: (params) => `La réservation de "${params.offer_name}" par ${params.buyer_fullname} a été annulée.`,
    getIcon: () => (
      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
        <CircleAlert className="text-red-500" />
      </div>
    ),
    getActions: () => []
  },
  'reservation_expired': {
    getTitle: () => 'Réservation expirée',
    getContent: (params) => `Votre réservation pour "${params.offer_name}" a expiré car le vendeur n'a pas confirmé à temps.`,
    getIcon: () => (
      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
        <CircleAlert className="text-orange-500" />
      </div>
    ),
    getActions: () => []
  },
  'transaction_completed': {
    getTitle: () => 'Transaction terminée',
    getContent: (params) => `La transaction pour "${params.offer_name}" a été complétée avec succès.`,
    getIcon: () => (
      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="text-green-500" />
      </div>
    ),
    getActions: () => []
  },
  'transaction_qr_validated': {
    getTitle: () => 'QR code validé',
    getContent: (params) => `Le QR code pour la transaction "${params.offer_name}" a été validé par ${params.buyer_fullname}.`,
    getIcon: () => (
      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="text-green-500" />
      </div>
    ),
    getActions: () => []
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const navigate = useNavigate();
  const donateProductMutation = useDonateProductMutation();
  
  const handler = notificationHandlers[notification.type] || {
    getTitle: () => 'Nouvelle notification',
    getContent: () => 'Vous avez une nouvelle notification.',
    getIcon: () => (
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
        <Bell className="text-gray-500" />
      </div>
    ),
    getActions: () => []
  };

  const title = handler.getTitle();
  const content = handler.getContent(notification.content);
  const icon = handler.getIcon();
  const params = {
    ...notification.content,
    donateProduct: (productId: number) => donateProductMutation.mutate(productId)
  };
  const actions = handler.getActions(params);

  const handleActionClick = (e: React.MouseEvent, action: NotificationAction) => {
    e.stopPropagation();
    if (!notification.isRead) {
      onClick(notification);
    }

    const result = action.onClick(e, params);
    if (result && result.type === 'navigate' && result.path) {
      navigate(result.path);
    }
  };

  return (
    <div
      onClick={() => onClick(notification)}
      className={cn(
        "p-4 border-b cursor-pointer transition-colors hover:bg-gray-50",
        !notification.isRead && "bg-purple-50"
      )}
    >
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className='flex items-center'>
              <h3 className={cn("font-medium", !notification.isRead && "font-semibold")}>
                {title}
              </h3>
              {!notification.isRead && (
                <Badge className="ml-2 bg-purple-100 text-purple-800">
                  Non lu
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
            </span>
          </div>
          <p className={cn("text-sm text-gray-600 mt-1", !notification.isRead && "text-gray-800")}>
            {content}
          </p>
          {actions.length > 0 && (
            <div className="flex gap-2 mt-2">
              {actions.map((action, index) => (
                <Button 
                  key={index}
                  size="sm" 
                  variant={action.variant || 'default'} 
                  className={action.className}
                  onClick={(e) => handleActionClick(e, action)}
                >
                  {action.title}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;