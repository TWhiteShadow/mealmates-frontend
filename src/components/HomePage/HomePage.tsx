import React from 'react';

const HomePage = () => {
    return (
        <div>
             <div className="flex flex-col items-center justify-center h-screen bg-gray-100 relative overflow-hidden">
              {/* Background circles */}
              <div data-layer="Ellipse 3" className="Ellipse3 w-80 h-96 left-[-238px] top-[-76.10px] absolute origin-top-left rotate-[-35.05deg] bg-purple-300 rounded-full" />
              
              {/* Logo and text */}
              <div className="relative flex flex-col items-center space-y-4">
               
                
                {/* Title */}
              </div>
              <div data-layer="Rectangle 2370" className="Rectangle2370 w-64 h-12 left-[63px] top-[696px] absolute bg-fuchsia-900 rounded-[10px]" />

              {/* Button */}
              <button data-layer="GO !" className="Go left-[171px] top-[705px] absolute text-center justify-center text-white text-2xl font-bold font-['Inter'] leading-snug bg-fuchsia-900-400">GO !

              </button>
              {/* Bottom bar */}
              <div className="absolute bottom-2 w-12 h-1 bg-black rounded-full"></div>
            </div>
        </div>
    );
};

export default HomePage;