import { FC, ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { userLogged } from '@/api/User';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await userLogged();
        setIsAuthenticated(response?.success === true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/app/login?redirectURI=${location.pathname}`} replace />;
  }

  return (
  <>
    {children}
  </>
  );
};

export default ProtectedRoute;