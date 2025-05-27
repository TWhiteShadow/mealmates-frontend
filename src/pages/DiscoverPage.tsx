import Discover from '../components/Discover/Discover';
import DiscoverSearchBar from '../components/Discover/DiscoverSearchBar';
import "../assets/browse-map.css";

function DiscoverPage() {
  return (
    <div className="min-h-screen relative bg-gray-100">
      <DiscoverSearchBar />
      <Discover />
    </div>
  );
}

export default DiscoverPage;
