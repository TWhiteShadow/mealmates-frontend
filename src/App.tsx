import { 
  Smartphone, 
  Utensils, 
  Users, 
  Clock, 
  DollarSign, 
  Leaf, 
  ArrowRight, 
  Apple, 
  Download,
  ArrowDown,
  Star 
} from 'lucide-react';
import MealMatesLogo from '/MealMatesLogo.png';
import HeroBannerImage from './assets/landing_page_hero-banner.png';
import CountUp from 'react-countup';
import { buttonVariants } from "@/components/ui/button";
import { cn } from './lib/utils';
import Rating from '@mui/material/Rating';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img src={MealMatesLogo} alt="MealMates Logo" className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold text-primary font-Lilita">MealMates</span>
              </div>
            </div>
            <div className="flex items-center">
              <a href="#download" className={cn(buttonVariants({ variant: 'default'}))}>
                Télécharger l'app
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative transition-[background] duration-150 md:bg-[linear-gradient(45deg,var(--color-purple-light)_51%,var(--color-purple-dark)_100%)] bg-[linear-gradient(125deg,var(--color-purple-light)_51%,var(--color-purple-dark)_100%)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                Arrêter le gaspillage, Économiser de l'argent, Sauvez la Planète!!!!
              </h1>
              <p className="mt-4 text-lg text-gray-700">
                Connectez-vous avec vos voisins pour partager les surplus
                alimentaires avant qu'ils ne finissent à la poubelle.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="#download" className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#5E1969] hover:bg-[#4a1253] transition-colors">
                  <ArrowDown className="mr-2 h-5 w-5 group-hover:animate-[bounce_1s_ease-in-out_infinite] transition-[transform]" />
                  Télécharger maintenant
                </a>
                <a href="#how-it-works" className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 transition-colors">
                  En apprendre plus
                  <ArrowDown className="ml-2 h-5 w-5 group-hover:animate-bounce rotate-270" />
                </a>
              </div>
            </div>
            <div className="relative">
              <img 
                src={HeroBannerImage}
                alt="MealMates App Preview" 
                className="rounded-lg shadow-xl mx-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <Rating name="half-rating-read" defaultValue={4.5} precision={0.25} readOnly />
                <p className="text-sm font-medium text-gray-900 mt-1 flex">Aimé par plus de {<CountUp start={1000} end={10200} duration={3} className='block !min-w-[45px] ml-1 text-end text-primary font-Lilita mr-0.5' />} utilisateurs</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary font-Lilita">Comment MealMates Fonctionne</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Rejoignez la révolution du partage alimentaire en trois étapes simples
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-light bg-opacity-20 p-8 rounded-lg text-center">
              <div className="bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Téléchargez & Inscrivez-vous</h3>
              <p className="text-gray-600">
                Installez l'application MealMates sur votre téléphone et créez votre compte en quelques secondes.
              </p>
            </div>
            
            <div className="bg-purple-light bg-opacity-20 p-8 rounded-lg text-center">
              <div className="bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Parcourez & Réservez</h3>
              <p className="text-gray-600">
                Découvrez les surplus alimentaires de voisins proches de chez vous et réservez ce qui vous intéresse.
              </p>
            </div>
            
            <div className="bg-purple-light bg-opacity-20 p-8 rounded-lg text-center">
              <div className="bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Récupérez & Savourez</h3>
              <p className="text-gray-600">
              Récupérez votre nourriture chez votre voisin et profitez de délicieux repas à moindre coût.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-purple-light bg-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary font-Lilita">Pourquoi Choisir MealMates?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Rejoignez des milliers de personnes qui font la différence un repas à la fois
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Leaf className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Réduire le Gaspillage Alimentaire</h3>
              <p className="text-gray-600">
                Aidez à sauver des aliments parfaitement bons d'être jetés. Un foyer moyen gaspille 30% de la nourriture qu'il achète.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Économiser de l'Argent</h3>
              <p className="text-gray-600">
                Obtenez des aliments délicieux à une fraction du prix de détail. Les utilisateurs économisent en moyenne 25€ par semaine.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Créer du Lien Social</h3>
              <p className="text-gray-600">
              Connectez-vous avec vos voisins et construisez une communauté locale plus forte et plus durable.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Clock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Pratique & Rapide</h3>
              <p className="text-gray-600">
              Notre fonction de géolocalisation vous aide à trouver de la nourriture à proximité, rendant la récupération rapide et facile.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Star className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Plateforme de Confiance</h3>
              <p className="text-gray-600">
              Notre système d'évaluation garantit des expériences de qualité. 95% de nos utilisateurs notent leur expérience 4+ étoiles.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Smartphone className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Facile à Utiliser</h3>
              <p className="text-gray-600">
                Notre application intuitive rend la publication ou la recherche de nourriture simple et sans tracas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary font-Lilita">Ce Que Disent Nos Utilisateurs</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs satisfaits qui font la différence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-light bg-opacity-20 p-6 rounded-lg">
              <div className="flex mb-4">
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
              </div>
              <p className="text-gray-700 mb-4">
                "J'ai économisé tellement d'argent grâce à MealMates ! En plus, j'ai rencontré des voisins formidables qui partagent ma passion pour la réduction des déchets."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#C19EE0] flex items-center justify-center text-white font-bold">S</div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-primary">Sophie L.</h4>
                  <p className="text-xs text-gray-500">Utilisatrice MealMates</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-light bg-opacity-20 p-6 rounded-lg">
              <div className="flex mb-4">
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
              </div>
              <p className="text-gray-700 mb-4">
                "En tant qu'étudiant, MealMates a révolutionné mon budget. J'obtiens de la nourriture de qualité pour une fraction du prix!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#C19EE0] flex items-center justify-center text-white font-bold">M</div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-primary">Marco T.</h4>
                  <p className="text-xs text-gray-500">Utilisateur MealMates certifié</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-light bg-opacity-20 p-6 rounded-lg">
              <div className="flex mb-4">
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
              </div>
              <p className="text-gray-700 mb-4">
                "J'avais l'habitude de jeter beaucoup de nourriture. Maintenant, je peux la partager avec d'autres et gagner un peu d'argent en même temps. Tout le monde y gagne!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#C19EE0] flex items-center justify-center text-white font-bold">J</div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-primary">Julie R.</h4>
                  <p className="text-xs text-gray-500">Utilisatrice MealMates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="download" className="py-20 bg-gradient-to-r from-[#5E1969] to-[#C19EE0] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 font-Lilita">Téléchargez MealMates Aujourd'hui</h2>
              <p className="text-lg mb-8">
              Rejoignez des milliers d'utilisateurs qui économisent déjà de l'argent, réduisent le gaspillage et créent du lien social avec MealMates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 transition-colors">
                  <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5227 19.2951C16.7342 20.0836 15.7703 20.0836 14.9818 19.6894C14.1932 19.2951 12.6591 19.2951 11.8705 19.6894C10.8875 20.0836 9.92359 20.0836 9.13505 19.2951C6.96505 17.1251 6.17651 13.1894 8.34651 10.6251C9.52932 9.04794 11.4761 9.04794 13.4227 9.04794C15.3693 9.04794 17.3161 9.04794 18.4989 10.6251C20.6689 13.1894 19.8803 17.1251 17.5227 19.2951Z" stroke="#5E1969" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.7704 6.48366C15.7704 7.67366 14.9818 8.65651 13.9989 8.65651C13.0159 8.65651 12.2273 7.67366 12.2273 6.48366C12.2273 5.29366 13.0159 4.31079 13.9989 4.31079C14.9818 4.31079 15.7704 5.29366 15.7704 6.48366Z" stroke="#5E1969" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  App Store
                </a>
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 transition-colors">
                  <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 4.5H16.5C17.12 4.5 17.67 4.62 18.16 4.84C19.84 5.54 21 7.24 21 9.24V14.76C21 18.09 18.09 21 14.76 21H9.24C5.91 21 3 18.09 3 14.76V9.24C3 5.91 5.91 3 9.24 3H14.76C15.5 3 16.21 3.14 16.86 3.39" stroke="#5E1969" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 12L10.5 8.40002V15.6L16.5 12Z" stroke="#5E1969" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="MealMates App on Phone" 
                className="rounded-lg shadow-2xl mx-auto"
              />
              <div className="absolute -top-6 -left-6 bg-white p-4 rounded-full shadow-lg">
                <div className="bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center">
                  <Download className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
              <img src={MealMatesLogo} alt="MealMates Logo" className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold text-primary font-Lilita">MealMates</span>
              </div>
              <p className="mt-4 text-gray-600">
              Partager de la nourriture avec votre entourage, économiser de l'argent et réduire les déchets.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">ENTREPRISE</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">À Propos</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Carrières</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Presse</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Assistance</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">Centre d'Aide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Contactez-Nous</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Politique de Confidentialité</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Conditions d'Utilisation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Nous suivre</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">Instagram</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Facebook</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-center text-gray-500">
              &copy; {new Date().getFullYear()} MealMates. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;