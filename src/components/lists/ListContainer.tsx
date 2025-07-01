import { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ListContainerProps {
  isLoading: boolean;
  items: any[] | undefined;
  renderItem: (item: any) => ReactNode;
  emptyMessage: string | ReactNode;
  skeletonHeight?: string;
  skeletonCount?: number;
}

const ListContainer = ({
  isLoading,
  items,
  renderItem,
  emptyMessage,
  skeletonHeight = 'h-24',
  skeletonCount = 3,
}: ListContainerProps) => {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array(skeletonCount)
          .fill(0)
          .map((_, index) => (
            <Skeleton
              key={index}
              className={`${skeletonHeight} bg-gray-200 w-full rounded-lg`}
            />
          ))}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {items && items.length > 0 ? (
        items.map(renderItem)
      ) : (
        <div className='text-center py-8'>
          {typeof emptyMessage === 'string' ? (
            <p className='text-gray-500 mb-4'>{emptyMessage}</p>
          ) : (
            emptyMessage
          )}
        </div>
      )}
    </div>
  );
};

export default ListContainer;
