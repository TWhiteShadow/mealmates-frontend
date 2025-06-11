import { buttonVariants } from '@/components/ui/button';
import { cn } from '../../lib/utils';
import MealMatesLogo from '@/assets/MealMatesLogo.webp';

function Navbar() {
  return (
    <nav className='bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 flex items-center'>
              <a href='/' className='flex items-center'>
                <img
                  src={MealMatesLogo}
                  alt='MealMates Logo'
                  className='h-12 w-12'
                />
                <div className='flex items-center gap-0'>
                  <span className='ml-2 text-xl text-primary font-Lilita hidden sm:block'>
                    Meal
                  </span>
                  <span className='text-xl text-purple-semi-dark font-Lilita hidden sm:block'>
                    Mates
                  </span>
                </div>
              </a>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <a
              href='#download'
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              Télécharger l'app
            </a>
            <a
              href='/app/login'
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Se Connecter
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
