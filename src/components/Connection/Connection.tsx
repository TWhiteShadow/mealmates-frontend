import { buttonVariants } from '@/components/ui/button';
import { cn } from '../../lib/utils';
import logo from '../../assets/mealmates-icon.png';
import googleLogo from '../../assets/google_logo.svg';
import githubLogo from '../../assets/github_logo.svg';

const HomePage = () => {
  return (
    <div className='z-20'>
      <div className='flex flex-col items-center justify-center h-screen relative overflow-hidden'>
        <div className='relative flex flex-col items-center space-y-4'>
          <img src={logo} alt='logo' className='w-[90vw] max-w-64 ' />
        </div>

        <div className='flex flex-col items-center mt-8 gap-5'>
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/connect/github`}
            className={cn(buttonVariants({ variant: 'github' }), 'w-full')}
          >
            <img src={githubLogo} className='h-full invert' alt='Github Logo' />
            <span>Connexion avec Github</span>
          </a>
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/connect/google`}
            className={cn(buttonVariants({ variant: 'google' }), 'w-full')}
          >
            <img src={googleLogo} className='h-full' alt='Google Logo' />
            <span>Connexion avec Google</span>
          </a>
          <a
            href='login/register'
            className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
          >
            Connexion par mail
          </a>
          <a href='discover' className='text-purple-semi-dark'>
            Ignorer pour le moment
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
