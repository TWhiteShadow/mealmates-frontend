import { FC, ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { userLogged } from '@/api/User';
import { toast } from 'sonner';

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
      } catch (error: any) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          // Let Axios handle the refresh token logic
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            const retryResponse = await userLogged();
            setIsAuthenticated(retryResponse?.success === true);
          } catch (retryError: any) {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
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
    // triggers twice but only in dev mode
    toast.info('Vous devez être connecté pour accéder à cette page.');
    return <Navigate to={`/app/login?redirectURI=${location.pathname}`} replace />;
  }

  return (
    <>
      {children}
    </>
  );
};

export default ProtectedRoute;