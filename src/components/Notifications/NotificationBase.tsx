import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';
import { NotificationAction } from '@/api/Notification';

interface NotificationBaseProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  actions: NotificationAction[];
  badgeColor?: string;
  timeLeft?: number | null; // custom for limited time notifications
  onClick: () => void;
  onActionClick: (e: React.MouseEvent, action: NotificationAction) => void;
}

const NotificationBase: React.FC<NotificationBaseProps> = ({
  icon,
  title,
  content,
  createdAt,
  isRead,
  actions,
  badgeColor = 'bg-gray-100 text-gray-800',
  timeLeft,
  onClick,
  onActionClick
}) => {
  const formattedTimeLeft = timeLeft !== null && timeLeft !== undefined
    ? formatDistanceToNow(new Date(Date.now() + timeLeft * 1000), { 
        addSuffix: true, 
        locale: fr 
      }) 
    : null;

  const getPriorityIndicator = () => {
    if (timeLeft !== null && timeLeft !== undefined && !isRead) {
      return (
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" 
             title="Action requise" />
      );
    }
    return null;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border-b cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm",
        !isRead && "bg-blue-50/50 border-l-4 border-l-purple-semi-dark"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          {icon}
          {getPriorityIndicator() && (
            <div className="absolute -top-1 -right-1">
              {getPriorityIndicator()}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-medium text-gray-900",
                !isRead && "font-semibold"
              )}>
                {title}
              </h3>
              {!isRead && (
                <Badge className={cn("text-xs", badgeColor)}>
                  Nouveau
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatDistanceToNow(new Date(createdAt), { 
                addSuffix: true, 
                locale: fr 
              })}
            </span>
          </div>
          
          <p className={cn(
            "text-sm text-gray-600 mb-2 leading-relaxed",
            !isRead && "text-gray-800 font-medium"
          )}>
            {content}
            {formattedTimeLeft && (
              <span className="block text-xs text-gray-500 mt-1">
                {formattedTimeLeft} avant expiration
              </span>
            )}
          </p>
          
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action, index) => (
                <Button 
                  key={index}
                  size="sm" 
                  variant={action.variant || 'default'} 
                  className={cn(
                    "h-8 text-xs font-medium transition-all duration-200",
                    action.className
                  )}
                  onClick={(e) => onActionClick(e, action)}
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

export default NotificationBase;
