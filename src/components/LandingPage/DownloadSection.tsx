import { Download } from 'lucide-react';
import PhoneMockup from '../../assets/phone-mockup.png';

function DownloadSection() {
  return (
    <section
      id='download'
      className='py-20 bg-gradient-to-b md:bg-gradient-to-r from-[#5E1969] to-[#C19EE0] text-white'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-4xl trac font-bold mb-6 font-Lilita'>
              Téléchargez MealMates Aujourd'hui
            </h2>
            <p className='text-lg mb-8'>
              Rejoignez des milliers d'utilisateurs qui économisent déjà de
              l'argent, réduisent le gaspillage et créent du lien social avec
              MealMates.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <a
                href='/app'
                className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 transition-colors'
              >
                <svg
                  className='h-6 w-6 mr-2'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M17.5227 19.2951C16.7342 20.0836 15.7703 20.0836 14.9818 19.6894C14.1932 19.2951 12.6591 19.2951 11.8705 19.6894C10.8875 20.0836 9.92359 20.0836 9.13505 19.2951C6.96505 17.1251 6.17651 13.1894 8.34651 10.6251C9.52932 9.04794 11.4761 9.04794 13.4227 9.04794C15.3693 9.04794 17.3161 9.04794 18.4989 10.6251C20.6689 13.1894 19.8803 17.1251 17.5227 19.2951Z'
                    stroke='#5E1969'
                    strokeWidth='1.5'
                    strokeMiterlimit='10'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M15.7704 6.48366C15.7704 7.67366 14.9818 8.65651 13.9989 8.65651C13.0159 8.65651 12.2273 7.67366 12.2273 6.48366C12.2273 5.29366 13.0159 4.31079 13.9989 4.31079C14.9818 4.31079 15.7704 5.29366 15.7704 6.48366Z'
                    stroke='#5E1969'
                    strokeWidth='1.5'
                    strokeMiterlimit='10'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                App Store
              </a>
              <a
                href='/app'
                className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 transition-colors'
              >
                <svg
                  className='h-6 w-6 mr-2'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.5 4.5H16.5C17.12 4.5 17.67 4.62 18.16 4.84C19.84 5.54 21 7.24 21 9.24V14.76C21 18.09 18.09 21 14.76 21H9.24C5.91 21 3 18.09 3 14.76V9.24C3 5.91 5.91 3 9.24 3H14.76C15.5 3 16.21 3.14 16.86 3.39'
                    stroke='#5E1969'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M16.5 12L10.5 8.40002V15.6L16.5 12Z'
                    stroke='#5E1969'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                Google Play
              </a>
            </div>
          </div>
          <div className='relative'>
            <img
              src={PhoneMockup}
              alt='MealMates App on Phone'
              className='rounded-lg shadow-2xl mx-auto'
            />
            <div className='absolute -top-6 -left-6 bg-white p-4 rounded-full shadow-lg'>
              <div className='bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center'>
                <Download className='h-8 w-8 text-white' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DownloadSection;
