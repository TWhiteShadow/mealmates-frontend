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
}

const StatCard = ({ title, value, unit, icon, children, className }: StatCardProps & { children?: ReactNode }) => {
  return (
    <div className="bg-white p-4 rounded-lg drop-shadow-lg text-center">
      <div className="text-sm text-gray-600 font-bold">{title}</div>
      <div className={cn("flex justify-center mb-2", className)}>
        {icon}
      </div>
      <div className="font-semibold mt-1">
        {value} {unit}
      </div>
      {children}
    </div>
  );
};

export default StatCard;
