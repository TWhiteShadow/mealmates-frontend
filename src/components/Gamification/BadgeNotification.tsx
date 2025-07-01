import { Badge } from '@/api/Gamification';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

// Fonction pour récupérer l'icône Lucide en fonction du nom
const getBadgeIcon = (iconName: string): React.ReactNode => {
  // Convertir le premier caractère en majuscule et le reste en minuscule
  const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  
  // Gérer les noms composés avec tirets (les convertir en camelCase)
  const camelCaseIconName = formattedIconName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  // Accéder à l'icône dans la bibliothèque Lucide
  // @ts-ignore - Nous savons que nous accédons à des propriétés dynamiquement
  const IconComponent = (LucideIcons as any)[camelCaseIconName] || LucideIcons.Award;

  return <IconComponent className="h-12 w-12 text-purple-600" />;
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

interface BadgeNotificationProps {
  badge: Badge;
  open: boolean;
  onClose: () => void;
}

const BadgeNotification = ({
  badge,
  open,
  onClose
}: BadgeNotificationProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleViewBadges = () => {
    handleClose();
    navigate('/app/profile/badges');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-sm mx-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-3 top-3"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center mb-2">
            <div className={cn(
              'p-4 rounded-full animate-pulse',
              getBadgeColor(badge.category)
            )}>
              {getBadgeIcon(badge.icon || 'award')}
            </div>
          </div>
          
          <AlertDialogTitle className="text-xl text-purple-dark">
            Nouveau badge obtenu !
          </AlertDialogTitle>
          
          <AlertDialogDescription className="space-y-2">
            <p className="font-semibold">{badge.name}</p>
            <p className="text-sm">{badge.description}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex flex-col gap-2 mt-4">
          <Button
            onClick={handleViewBadges}
            className="bg-purple-dark hover:bg-purple-900 text-white"
          >
            Voir tous mes badges
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Fermer
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BadgeNotification;
