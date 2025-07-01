import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import ProfileAppBar from '@/components/ProfileAppBar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  rightAction?: {
    icon: ReactNode;
    onClick: () => void;
  };
}

const PageLayout = ({ title, children, rightAction }: PageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen pb-20 relative bg-gray-100'>
      <ProfileAppBar>
        <div className='relative flex items-center size-full justify-center'>
          <Button
            variant='ghost'
            className='absolute left-3 p-1'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className='size-8 text-purple-dark' />
          </Button>
          <h1 className='font-bold text-xl'>{title}</h1>
          {rightAction && (
            <Button
              variant='ghost'
              className='absolute right-3 p-1'
              onClick={rightAction.onClick}
            >
              {rightAction.icon}
            </Button>
          )}
        </div>
      </ProfileAppBar>

      <div className='max-w-md mx-auto px-4 mt-6'>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
