import logo from '../../assets/mealmates-icon.png';

const Discover = () => {
  return (
    <div className='z-20'>
      <div className='flex flex-col items-center justify-center h-screen relative overflow-hidden'>
        <div className='relative flex flex-col items-center space-y-4'>
          <img src={logo} alt='logo' className='w-[90vw] max-w-64 ' />
        </div>
      </div>
    </div>
  );
};

export default Discover;
