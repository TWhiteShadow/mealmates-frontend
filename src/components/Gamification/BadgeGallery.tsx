import { Badge as BadgeType } from '@/api/Gamification';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import * as LucideIcons from 'lucide-react';

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
  
  return colors[category] || 'bg-gray-100';
};

// Fonction pour récupérer l'icône Lucide en fonction du nom
const getBadgeIcon = (iconName: string, isUnlocked: boolean): React.ReactNode => {
  // Convertir le premier caractère en majuscule et le reste en minuscule
  const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  
  // Gérer les noms composés avec tirets (les convertir en camelCase)
  const camelCaseIconName = formattedIconName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  // Accéder à l'icône dans la bibliothèque Lucide
  // @ts-ignore - Nous savons que nous accédons à des propriétés dynamiquement
  const IconComponent = (LucideIcons as any)[camelCaseIconName] || LucideIcons.HelpCircle;

  const color = isUnlocked ? (
    iconName.includes('award') ? 'text-yellow-600' : 'text-purple-600'
  ) : 'text-gray-400';

  return <IconComponent className={cn('h-8 w-8', color)} />;
};

interface BadgeGalleryProps {
  badges: BadgeType[];
  isLoading?: boolean;
  className?: string;
  showLocked?: boolean;
}

const BadgeGallery = ({
  badges,
  isLoading = false,
  className,
  showLocked = true,
}: BadgeGalleryProps) => {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-3 md:grid-cols-4 gap-4', className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  const displayBadges = showLocked ? badges : badges.filter(badge => badge.isUnlocked);

  if (displayBadges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun badge disponible pour le moment.
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-3 md:grid-cols-4 gap-4', className)}>
      {displayBadges.map((badge) => (
        <TooltipProvider key={badge.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  'flex flex-col items-center gap-1 p-2 cursor-pointer transition-all hover:scale-105',
                  !badge.isUnlocked && 'opacity-40 grayscale'
                )}
              >
                <div className="relative">
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center",
                    getBadgeColor(badge.category)
                  )}>
                    {getBadgeIcon(badge.icon, badge.isUnlocked)}
                  </div>
                  {badge.tier > 1 && (
                    <Badge 
                      variant="outline"
                      className="absolute -bottom-1 -right-1 bg-purple-dark text-white text-xs"
                    >
                      {badge.tier}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium text-center">{badge.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-center">
              <p className="font-semibold">{badge.name}</p>
              <p className="text-sm">{badge.description}</p>
              {badge.isUnlocked && badge.unlockedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Obtenu le {format(new Date(badge.unlockedAt), 'dd MMMM yyyy', { locale: fr })}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default BadgeGallery;
