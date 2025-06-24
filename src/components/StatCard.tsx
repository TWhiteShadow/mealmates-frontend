import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
}

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  icon: ReactNode;
  className?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, unit, icon, children, className, isLoading }: StatCardProps & { children?: ReactNode }) => {
  return (
    <div className="bg-white p-4 rounded-lg drop-shadow-lg text-center h-42">
      <div className="text-sm text-gray-600 font-bold">{title}</div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[90%]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark"></div>
        </div>
      ) : (
        <>
          <div className={cn("flex justify-center mb-2", className)}>
            {icon}
          </div>
          <div className="font-semibold mt-1">
            {value} {unit}
          </div>
          {children}
        </>
      )}
    </div>
  );
};

export default StatCard;
