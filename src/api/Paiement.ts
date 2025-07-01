import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './Axios';

export async function reserveProduct(id: number) {
  const response = await api.post(`/payments/reserve/${id}`);
  return response.data;
}
export function useReserveProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reserveProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export async function confirmReservation(id: number) {
  const response = await api.post(`/payments/reservations/${id}/confirm`);
  return response.data;
}
export function useConfirmReservationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => confirmReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export async function cancelReservation(id: number) {
  const response = await api.post(`/payments/reservations/${id}/cancel`);
  return response.data;
}
export function useCancelReservationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export async function getTransactionPaymentLink(
  id: number,
  redirectURI: string | null
): Promise<string> {
  const response = await api.post(`/payments/transactions/${id}/pay`, null, {
    params: { redirectURI },
  });
  return response.data;
}

export const useTransactionPaymentLink = (
  id: number,
  redirectURI: string | null,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['transactionPaymentLink', id],
    queryFn: () => getTransactionPaymentLink(id, redirectURI),
    enabled: enabled && id > 0,
  });
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

export const getGeneratedQRCodeLink = async (
  transactionId: number
): Promise<string> => {
  const response = await api.post(
    `/payments/transactions/${transactionId}/generate-qr`
  );
  const url =
    import.meta.env.VITE_BACKEND_URL +
    `/api/v1/payments/transactions/${transactionId}/validate-qr?token=` +
    response.data.token;
  return url;
};

export const useGeneratedQRCodeToken = (
  transactionId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['generatedQRCodeToken', transactionId],
    queryFn: () => getGeneratedQRCodeLink(transactionId),
    enabled: enabled && transactionId > 0,
  });
};

export const validateQRCode = async (url: string): Promise<boolean> => {
  const response = await api.post(url);
  return response.data;
};
