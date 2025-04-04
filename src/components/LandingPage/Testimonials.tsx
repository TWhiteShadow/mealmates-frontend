import { Star } from 'lucide-react';

interface TestimonialCardProps {
  text: string;
  name: string;
  title: string;
  initial: string;
}

function TestimonialCard({ text, name, title, initial }: TestimonialCardProps) {
  return (
    <div className='bg-gray-100 border border-purple-200 bg-opacity-20 p-6 rounded-lg'>
      <div className='flex mb-4'>
        <Star className='h-5 w-5 text-[#5e1969]' fill='#5e1969' />
        <Star className='h-5 w-5 text-[#5e1969]' fill='#5e1969' />
        <Star className='h-5 w-5 text-[#5e1969]' fill='#5e1969' />
        <Star className='h-5 w-5 text-[#5e1969]' fill='#5e1969' />
        <Star className='h-5 w-5 text-[#5e1969]' fill='#5e1969' />
      </div>
      <p className='text-gray-700 mb-4'>{text}</p>
      <div className='flex items-center'>
        <div className='h-10 w-10 rounded-full bg-[#C19EE0] flex items-center justify-center text-white font-bold'>
          {initial}
        </div>
        <div className='ml-3'>
          <h4 className='text-sm font-semibold text-primary'>{name}</h4>
          <p className='text-xs text-gray-600'>{title}</p>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:Quepx-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl tracking-wide font-bold text-primary font-Lilita'>
            Ce que Disent nos Utilisateurs
          </h2>
          <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
            Rejoignez des milliers d'utilisateurs satisfaits qui font la
            différence
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <TestimonialCard
            text="J'ai économisé tellement d'argent grâce à MealMates ! En plus, j'ai rencontré des voisins formidables qui partagent ma passion pour la réduction des déchets."
            name='Sophie L.'
            title='Utilisatrice MealMates'
            initial='S'
          />

          <TestimonialCard
            text="En tant qu'étudiant, MealMates a révolutionné mon budget. J'obtiens de la nourriture de qualité pour une fraction du prix!"
            name='Marco T.'
            title='Utilisateur MealMates certifié'
            initial='M'
          />

          <TestimonialCard
            text="J'avais l'habitude de jeter beaucoup de nourriture. Maintenant, je peux la partager avec d'autres et gagner un peu d'argent en même temps. Tout le monde y gagne!"
            name='Julie R.'
            title='Utilisatrice MealMates'
            initial='J'
          />
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
