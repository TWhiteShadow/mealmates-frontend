import MealMatesLogo from '/MealMatesLogo.png';

function Footer() {
  return (
    <footer className='bg-white py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <div className='flex items-center'>
              <img
                src={MealMatesLogo}
                alt='MealMates Logo'
                className='h-8 w-8'
              />
              <span className='ml-2 text-xl font-bold text-primary font-Lilita'>
                MealMates
              </span>
            </div>
            <p className='mt-4 text-gray-600'>
              Partager de la nourriture avec votre entourage, économiser de
              l'argent et réduire les déchets.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-semibold text-gray-900 tracking-wider uppercase'>
              ENTREPRISE
            </h3>
            <ul className='mt-4 space-y-2'>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  À Propos
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  Carrières
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  Presse
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold text-gray-900 tracking-wider uppercase'>
              Assistance
            </h3>
            <ul className='mt-4 space-y-2'>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  Centre d'Aide
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  Contactez-Nous
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  Politique de Confidentialité
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  Conditions d'Utilisation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold text-gray-900 tracking-wider uppercase'>
              Nous suivre
            </h3>
            <ul className='mt-4 space-y-2'>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  Instagram
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  Twitter
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  Facebook
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-primary'>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 border-t border-gray-200 pt-8'>
          <p className='text-center text-gray-500'>
            &copy; {new Date().getFullYear()} MealMates. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
