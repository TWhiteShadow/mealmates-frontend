import Discover from '@/components/Discover/Discover';
import SearchBar from '@/components/SearchBar';
import Navbar from '@/components/ui/Navbar';
import "../assets/discover-map.css";

function DiscoverPage() {
  return (
    <div className="h-screen relative bg-gray-100 overflow-hidden">
      <div className='fixed top-0 left-0 w-full z-100'>
        <div className='max-w-md mx-auto pt-12 pb-6 px-4 xs:px-9 rounded-b-[20px] bg-purple-dark/10 backdrop-blur-lg'>
          <SearchBar />
        </div>
      </div>
      <Discover />
      
      <Navbar />
    </div>
  );
}

export default DiscoverPage;
