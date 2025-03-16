import { ArrowDown } from 'lucide-react';
import HeroBannerImage from '../../assets/landing_page_hero-banner.png';
import CountUp from 'react-countup';
import Rating from '@mui/material/Rating';

function HeroSection() {
  return (
    <section className='relative transition-[background] duration-150 md:bg-[linear-gradient(45deg,var(--color-purple-light)_51%,var(--color-purple-dark)_100%)] bg-[linear-gradient(125deg,var(--color-purple-light)_51%,var(--color-purple-dark)_100%)] py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          <div>
            <h1 className='text-4xl md:text-5xl font-bold text-primary leading-tight'>
              Arrêter le gaspillage, Économiser de l'argent, Sauvez la Planète.
            </h1>
            <p className='mt-4 text-lg text-gray-700'>
              Connectez-vous avec vos voisins pour partager les surplus
              alimentaires avant qu'ils ne finissent à la poubelle.
            </p>
            <div className='mt-8 flex flex-col sm:flex-row gap-4'>
              <a
                href='#download'
                className='group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#5E1969] hover:bg-[#4a1253] transition-colors'
              >
                <ArrowDown className='mr-2 h-5 w-5 group-hover:animate-[bounce_1s_ease-in-out_infinite] transition-[transform]' />
                Télécharger maintenant
              </a>
              <a
                href='#how-it-works'
                className='group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 transition-colors'
              >
                En apprendre plus
                <ArrowDown className='ml-2 h-5 w-5 group-hover:animate-bounce rotate-270' />
              </a>
            </div>
          </div>
          <div className='relative'>
            <img
              src={HeroBannerImage}
              alt='MealMates App Preview'
              className='rounded-lg shadow-xl mx-auto'
            />
            <div className='absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg'>
              <Rating
                name='half-rating-read'
                defaultValue={4.5}
                precision={0.25}
                readOnly
              />
              <p className='text-sm font-medium text-gray-900 mt-1 flex'>
                Aimé par plus de{' '}
                {
                  <CountUp
                    start={1000}
                    end={10200}
                    duration={3}
                    className='block !min-w-[45px] ml-1 text-end text-primary font-Lilita mr-0.5'
                  />
                }{' '}
                utilisateurs
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className='absolute bottom-0 left-0 right-0 h-16 bg-white'
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}
      ></div>
    </section>
  );
}

export default HeroSection;
