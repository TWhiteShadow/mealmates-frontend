import { useQuery } from '@tanstack/react-query';
import api from './Axios';

export type SellerEarningsType = {
  totalEarnings: number;
  pendingAmount: number;
  completedTransactions: number;
  pendingTransactions: number;
};

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

export const getSellerEarnings = async (): Promise<SellerEarningsType> => {
  const response = await api.get('/seller/earnings');
  return response.data;
};

export const useSellerEarnings = () => {
  return useQuery({
    queryKey: ['sellerEarnings'],
    queryFn: getSellerEarnings,
  });
};
