import Discover from '../components/Discover/Discover';
import Navbar from '@/components/ui/Navbar';
import "../assets/browse-map.css";

function DiscoverPage() {
  return (
    <div className="h-screen relative bg-gray-100 overflow-hidden">
      <Discover />
      
      <Navbar />
    </div>
  );
}

export default DiscoverPage;
