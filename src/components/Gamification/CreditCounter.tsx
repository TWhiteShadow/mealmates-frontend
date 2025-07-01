import { Credit } from '@/api/Gamification';
import { cn } from '@/lib/utils';
import { Coins } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CreditCounterProps {
  credits?: Credit;
  isLoading?: boolean;
  className?: string;
  showLifetime?: boolean;
}

const CreditCounter = ({
  credits,
  isLoading = false,
  className,
  showLifetime = true,
}: CreditCounterProps) => {
  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Coins className="text-yellow-500" />
        <Skeleton className="h-6 w-16" />
        {showLifetime && <Skeleton className="h-4 w-24 ml-2" />}
      </div>
    );
  }

  if (!credits) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex items-center bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
        <Coins className="text-yellow-500 h-4 w-4 mr-1" />
        <span className="font-bold text-yellow-700">{credits.balance}</span>
      </div>
      
      {showLifetime && (
        <span className="text-xs text-gray-500">
          (total gagné: {credits.lifetimeEarned})
        </span>
      )}
    </div>
  );
};

export default CreditCounter;
