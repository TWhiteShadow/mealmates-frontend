import { useQuery } from '@tanstack/react-query';
import api from './Axios';

export const getSellerStatus = async (): Promise<boolean> => {
  const response = await api.get('/seller/banking/status');
  return (
    response.data.hasAccount &&
    response.data.isReady &&
    response.data.canReceivePayments
  );
};

export const useSellerStatus = () => {
  return useQuery({
    queryKey: ['sellerStatus'],
    queryFn: getSellerStatus,
  });
};

export const getSellerSetup = async (): Promise<any> => {
  const response = await api.post('/seller/banking/setup');
  return response.data;
};

export const useSellerSetup = () => {
  return useQuery({
    queryKey: ['sellerSetup'],
    queryFn: getSellerSetup,
  });
};
