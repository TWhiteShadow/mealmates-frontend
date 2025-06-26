import BackgroundCircles from '@/components/ui/BackgroundCircles';
import Register from '@/components/Connection/Register';
const RegisterPage = () => {
  return (
    <div className='h-screen relative bg-gray-100 overflow-hidden z-20'>
      <BackgroundCircles />
      <Register />
    </div>
  );
};

export default RegisterPage;
