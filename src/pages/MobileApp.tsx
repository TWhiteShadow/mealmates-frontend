import BackgroundCircles from "@/components/ui/BackgroundCircles";
import HomePage from "@/components/HomePage/HomePage";

function Homepage() {
  return (
    <div className='h-screen relative bg-gray-100 overflow-hidden'>
      < BackgroundCircles />
      < HomePage />
    </div>
  );
}

export default Homepage;