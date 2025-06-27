import { buttonVariants } from '@/components/ui/button';
import { cn } from '../../lib/utils';
import logo from '../../assets/mealmates-icon.png';
import { Link } from 'react-router';

const HomePage = () => {
  return (
    <div className='z-20'>
      <div className='flex flex-col items-center justify-center h-screen relative overflow-hidden'>
        {/* Logo and text */}
        <div className='relative flex flex-col items-center space-y-4'>
          <img src={logo} alt='logo' className='w-[90vw] max-w-64 ' />
        </div>

        {/* Button */}
        <Link
          to='/app/login'
          className={cn(buttonVariants({ variant: 'default' })) + ' mt-32 w-50'}
        >
          GO !
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
