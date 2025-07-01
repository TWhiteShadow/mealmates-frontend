import { ProgressData } from '@/api/Gamification';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ProgressTrackerProps {
  progressData: ProgressData[];
  isLoading?: boolean;
  className?: string;
}

const ProgressTracker = ({
  progressData,
  isLoading = false,
  className,
}: ProgressTrackerProps) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!progressData || progressData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune progression disponible pour le moment.
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {progressData.map((progress) => (
        <div key={progress.id} className="space-y-2">
          <div className="flex justify-between items-end">
            <div>
              <h4 className="font-medium text-sm">{progress.name}</h4>
              {progress.nextBadgeName && (
                <p className="text-xs text-gray-500">Prochain badge : {progress.nextBadgeName}</p>
              )}
            </div>
            <span className="text-sm font-medium">
              {progress.currentValue} / {progress.targetValue} {progress.unit}
            </span>
          </div>
          <div className="space-y-1">
            <Progress 
              value={progress.percentage} 
              className={cn(
                "h-2",
                progress.percentage === 100 ? "[--primary:theme(colors.green.500)]" : "[--primary:theme(colors.purple.dark)]"
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
