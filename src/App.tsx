import React from 'react';
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
  Star 
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Apple className="h-8 w-8 text-[#5E1969]" />
                <span className="ml-2 text-xl font-bold text-[#5E1969]">MealMates</span>
              </div>
            </div>
            <div className="flex items-center">
              <a href="#download" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-[#5E1969] hover:bg-[#4a1253] transition-colors">
                Download App
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#D4C3E2] to-[#C19EE0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#5E1969] leading-tight">
                Save Food, Save Money, Save the Planet
              </h1>
              <p className="mt-4 text-lg text-gray-700">
                Connect with neighbors to share surplus food before it goes to waste. Buy delicious meals at a fraction of the price.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="#download" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#5E1969] hover:bg-[#4a1253] transition-colors">
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </a>
                <a href="#how-it-works" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#5E1969] bg-white hover:bg-gray-50 transition-colors">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="MealMates App Preview" 
                className="rounded-lg shadow-xl mx-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                  <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                  <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                  <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                  <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                </div>
                <p className="text-sm font-medium text-gray-900 mt-1">Loved by 10,000+ users</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#5E1969]">How MealMates Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join the food-sharing revolution in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#D4C3E2] bg-opacity-20 p-8 rounded-lg text-center">
              <div className="bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#5E1969] mb-3">Download & Sign Up</h3>
              <p className="text-gray-600">
                Get the MealMates app on your phone and create your account in seconds.
              </p>
            </div>
            
            <div className="bg-[#D4C3E2] bg-opacity-20 p-8 rounded-lg text-center">
              <div className="bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#5E1969] mb-3">Browse & Reserve</h3>
              <p className="text-gray-600">
                Discover surplus food from neighbors near you and reserve what you want.
              </p>
            </div>
            
            <div className="bg-[#D4C3E2] bg-opacity-20 p-8 rounded-lg text-center">
              <div className="bg-[#5E1969] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#5E1969] mb-3">Collect & Enjoy</h3>
              <p className="text-gray-600">
                Pick up your food from your neighbor and enjoy delicious meals for less.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#D4C3E2] bg-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#5E1969]">Why Choose MealMates?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of people making a difference one meal at a time
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Leaf className="h-10 w-10 text-[#5E1969] mb-4" />
              <h3 className="text-xl font-semibold text-[#5E1969] mb-2">Reduce Food Waste</h3>
              <p className="text-gray-600">
                Help save perfectly good food from being thrown away. The average household wastes 30% of the food they buy.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-10 w-10 text-[#5E1969] mb-4" />
              <h3 className="text-xl font-semibold text-[#5E1969] mb-2">Save Money</h3>
              <p className="text-gray-600">
                Get delicious food at a fraction of the retail price. Users save an average of €25 per week.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="h-10 w-10 text-[#5E1969] mb-4" />
              <h3 className="text-xl font-semibold text-[#5E1969] mb-2">Build Community</h3>
              <p className="text-gray-600">
                Connect with neighbors and build a stronger, more sustainable local community.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Clock className="h-10 w-10 text-[#5E1969] mb-4" />
              <h3 className="text-xl font-semibold text-[#5E1969] mb-2">Convenient & Fast</h3>
              <p className="text-gray-600">
                Our geolocation feature helps you find food nearby, making pickup quick and easy.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Star className="h-10 w-10 text-[#5E1969] mb-4" />
              <h3 className="text-xl font-semibold text-[#5E1969] mb-2">Trusted Platform</h3>
              <p className="text-gray-600">
                Our rating system ensures quality experiences. 95% of our users rate their experience 4+ stars.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Smartphone className="h-10 w-10 text-[#5E1969] mb-4" />
              <h3 className="text-xl font-semibold text-[#5E1969] mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Our intuitive app makes listing or finding food simple and hassle-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#5E1969]">What Our Users Say</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#D4C3E2] bg-opacity-20 p-6 rounded-lg">
              <div className="flex mb-4">
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
              </div>
              <p className="text-gray-700 mb-4">
                "I've saved so much money using MealMates! Plus, I've met some amazing neighbors who share my passion for reducing waste."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#C19EE0] flex items-center justify-center text-white font-bold">S</div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-[#5E1969]">Sophie L.</h4>
                  <p className="text-xs text-gray-500">MealMates User</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#D4C3E2] bg-opacity-20 p-6 rounded-lg">
              <div className="flex mb-4">
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
              </div>
              <p className="text-gray-700 mb-4">
                "As a student, MealMates has been a game-changer for my budget. I get quality food for a fraction of the price!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#C19EE0] flex items-center justify-center text-white font-bold">M</div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-[#5E1969]">Marco T.</h4>
                  <p className="text-xs text-gray-500">MealMates User</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#D4C3E2] bg-opacity-20 p-6 rounded-lg">
              <div className="flex mb-4">
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
              </div>
              <p className="text-gray-700 mb-4">
                "I used to throw away so much food. Now I can share it with others and make a little money too. Win-win!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#C19EE0] flex items-center justify-center text-white font-bold">J</div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-[#5E1969]">Julie R.</h4>
                  <p className="text-xs text-gray-500">MealMates User</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 bg-gradient-to-r from-[#5E1969] to-[#C19EE0] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Download MealMates Today</h2>
              <p className="text-lg mb-8">
                Join thousands of users who are already saving money, reducing waste, and building community with MealMates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#5E1969] bg-white hover:bg-gray-100 transition-colors">
                  <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5227 19.2951C16.7342 20.0836 15.7703 20.0836 14.9818 19.6894C14.1932 19.2951 12.6591 19.2951 11.8705 19.6894C10.8875 20.0836 9.92359 20.0836 9.13505 19.2951C6.96505 17.1251 6.17651 13.1894 8.34651 10.6251C9.52932 9.04794 11.4761 9.04794 13.4227 9.04794C15.3693 9.04794 17.3161 9.04794 18.4989 10.6251C20.6689 13.1894 19.8803 17.1251 17.5227 19.2951Z" stroke="#5E1969" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.7704 6.48366C15.7704 7.67366 14.9818 8.65651 13.9989 8.65651C13.0159 8.65651 12.2273 7.67366 12.2273 6.48366C12.2273 5.29366 13.0159 4.31079 13.9989 4.31079C14.9818 4.31079 15.7704 5.29366 15.7704 6.48366Z" stroke="#5E1969" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  App Store
                </a>
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#5E1969] bg-white hover:bg-gray-100 transition-colors">
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

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Apple className="h-8 w-8 text-[#5E1969]" />
                <span className="ml-2 text-xl font-bold text-[#5E1969]">MealMates</span>
              </div>
              <p className="mt-4 text-gray-600">
                Connecting neighbors to share food, save money, and reduce waste.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">Press</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">Instagram</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">Facebook</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#5E1969]">LinkedIn</a></li>
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