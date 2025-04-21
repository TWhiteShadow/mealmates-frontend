import { Smartphone, Utensils, Users } from 'lucide-react';

function HowItWorks() {
  return (
    <section id='how-it-works' className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold text-primary font-Lilita tracking-wide'>
            Comment Meal<span className='text-purple-semi-dark'>Mates</span> Fonctionne
          </h2>
          <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
            Rejoignez la révolution du partage alimentaire en trois étapes
            simples
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-purple-light bg-opacity-20 p-8 rounded-lg text-center'>
            <div className='bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6'>
              <Smartphone className='h-8 w-8 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-primary mb-3'>
              Téléchargez & Inscrivez-vous
            </h3>
            <p className='text-gray-600'>
              Installez l'application MealMates sur votre téléphone et créez
              votre compte en quelques secondes.
            </p>
          </div>

          <div className='bg-purple-light bg-opacity-20 p-8 rounded-lg text-center'>
            <div className='bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6'>
              <Utensils className='h-8 w-8 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-primary mb-3'>
              Parcourez & Réservez
            </h3>
            <p className='text-gray-600'>
              Découvrez les surplus alimentaires de voisins proches de chez vous
              et réservez ce qui vous intéresse.
            </p>
          </div>

          <div className='bg-purple-light bg-opacity-20 p-8 rounded-lg text-center'>
            <div className='bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6'>
              <Users className='h-8 w-8 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-primary mb-3'>
              Récupérez & Savourez
            </h3>
            <p className='text-gray-600'>
              Récupérez votre nourriture chez votre voisin et profitez de
              délicieux repas à moindre coût.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
