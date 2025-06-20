import api from '@/api/Axios';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await api.post('/logout');

      if (response.status === 200) {
        toast.success('Vous vous êtes déconnecté avec succès.');
        navigate('/app/login');
      } else {
        console.error('Logout failed');
        navigate('/app/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/app/login');
    }
  };

  return { logout };
};
