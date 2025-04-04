import { Leaf, DollarSign, Users, Clock, Star, Smartphone } from 'lucide-react';

function Features() {
  return (
    <section className='py-20 bg-purple-light bg-opacity-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl tracking-wide font-bold text-primary font-Lilita'>
            Pourquoi choisir Meal<span className='text-purple-semi-dark'>Mates</span>?
          </h2>
          <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
            Rejoignez des milliers de personnes qui font la différence un repas
            à la fois
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow-sm'>
            <Leaf className='h-10 w-10 text-primary mb-4' />
            <h3 className='text-xl font-semibold text-primary mb-2'>
              Réduire le Gaspillage Alimentaire
            </h3>
            <p className='text-gray-600'>
              Aidez à sauver des aliments parfaitement bons d'être jetés. Un
              foyer moyen gaspille 30% de la nourriture qu'il achète.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm'>
            <DollarSign className='h-10 w-10 text-primary mb-4' />
            <h3 className='text-xl font-semibold text-primary mb-2'>
              Économiser de l'Argent
            </h3>
            <p className='text-gray-600'>
              Obtenez des aliments délicieux à une fraction du prix de détail.
              Les utilisateurs économisent en moyenne 25€ par semaine.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm'>
            <Users className='h-10 w-10 text-primary mb-4' />
            <h3 className='text-xl font-semibold text-primary mb-2'>
              Créer du Lien Social
            </h3>
            <p className='text-gray-600'>
              Connectez-vous avec vos voisins et construisez une communauté
              locale plus forte et plus durable.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm'>
            <Clock className='h-10 w-10 text-primary mb-4' />
            <h3 className='text-xl font-semibold text-primary mb-2'>
              Pratique & Rapide
            </h3>
            <p className='text-gray-600'>
              Notre fonction de géolocalisation vous aide à trouver de la
              nourriture à proximité, rendant la récupération rapide et facile.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm'>
            <Star className='h-10 w-10 text-primary mb-4' />
            <h3 className='text-xl font-semibold text-primary mb-2'>
              Plateforme de Confiance
            </h3>
            <p className='text-gray-600'>
              Notre système d'évaluation garantit des expériences de qualité.
              95% de nos utilisateurs notent leur expérience 4+ étoiles.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm'>
            <Smartphone className='h-10 w-10 text-primary mb-4' />
            <h3 className='text-xl font-semibold text-primary mb-2'>
              Facile à Utiliser
            </h3>
            <p className='text-gray-600'>
              Notre application intuitive rend la publication ou la recherche de
              nourriture simple et sans tracas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
