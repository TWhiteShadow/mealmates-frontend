import Navbar from './components/LandingPage/Navbar';
import HeroSection from './components/LandingPage/HeroSection';
import HowItWorks from './components/LandingPage/HowItWorks';
import Features from './components/LandingPage/Features';
import Testimonials from './components/LandingPage/Testimonials';
import DownloadSection from './components/LandingPage/DownloadSection';
import Footer from './components/LandingPage/Footer';

function App() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Features />
      <Testimonials />
      <DownloadSection />
      <Footer />
    </div>
  );
}

export default App;
