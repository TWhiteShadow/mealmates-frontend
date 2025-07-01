import { GamificationNotification } from '@/api/Gamification';
import { cn } from '@/lib/utils';
import { Coins } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// Fonction pour récupérer l'icône Lucide en fonction du nom
const getBadgeIcon = (iconName: string): React.ReactNode => {
  // Convertir le premier caractère en majuscule et le reste en minuscule
  const formattedIconName = iconName?.charAt(0).toUpperCase() + iconName?.slice(1).toLowerCase();
  
  // Gérer les noms composés avec tirets (les convertir en camelCase)
  const camelCaseIconName = formattedIconName?.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  if (!camelCaseIconName) {
    return <LucideIcons.Award className="h-6 w-6 text-purple-600" />;
  }
  
  // Accéder à l'icône dans la bibliothèque Lucide
  // @ts-ignore - Nous savons que nous accédons à des propriétés dynamiquement
  const IconComponent = (LucideIcons as any)[camelCaseIconName] || LucideIcons.Award;

  return <IconComponent className="h-6 w-6 text-purple-600" />;
};

// Fonction pour obtenir la couleur du badge en fonction de sa catégorie
const getBadgeColor = (category: string): string => {
  const colors: Record<string, string> = {
    'OFFER_CREATED': 'bg-blue-100',
    'FOOD_SAVED': 'bg-green-100',
    'TRANSACTIONS_COMPLETED': 'bg-amber-100',
    'REVIEWS_RECEIVED': 'bg-purple-100',
    'REVIEWS_GIVEN': 'bg-indigo-100',
    'ACCOUNT_AGE': 'bg-pink-100',
    'CONSECUTIVE_DAYS': 'bg-orange-100',
  };
  
  return colors[category] || 'bg-purple-100';
};

interface GamificationHistoryProps {
  notifications?: GamificationNotification[];
  isLoading?: boolean;
  className?: string;
  emptyMessage?: string;
}

const GamificationHistory = ({
  notifications,
  isLoading = false,
  className,
  emptyMessage = "Aucun événement de gamification pour le moment.",
}: GamificationHistoryProps) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {notifications.map((notification) => (
        <div 
          key={notification.id} 
          className={cn(
            "flex items-start gap-3 p-3 border rounded-lg transition-colors",
            !notification.isRead ? "bg-purple-50" : "bg-white"
          )}
        >
          {notification.type === 'badge' ? (
            <div className={cn(
              "rounded-full p-2",
              notification.badgeCategory ? getBadgeColor(notification.badgeCategory) : "bg-purple-100"
            )}>
              {getBadgeIcon(notification.badgeIcon || 'award')}
            </div>
          ) : (
            <div className="rounded-full bg-yellow-100 p-2">
              <Coins className="h-6 w-6 text-yellow-600" />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{notification.title}</h4>
              <Badge variant="outline" className="text-xs font-normal">
                {format(new Date(notification.createdAt), 'dd MMM yyyy', { locale: fr })}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{notification.description}</p>
            {notification.type === 'credit' && notification.value && (
              <div className="mt-2 flex items-center gap-1">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium text-yellow-700">+{notification.value}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GamificationHistory;
