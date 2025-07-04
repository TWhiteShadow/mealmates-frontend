import BackgroundCircles from '@/components/ui/BackgroundCircles';
import Login from '@/components/Connection/Login';
const LoginPage = () => {
  return (
    <div className='h-screen relative bg-gray-100 overflow-hidden z-20'>
      <BackgroundCircles />
      <Login />
    </div>
  );
};

export default LoginPage;
