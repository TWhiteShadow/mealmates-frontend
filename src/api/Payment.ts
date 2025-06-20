import api from './Axios';

export interface CheckoutResponse {
  isFreeOffer?: boolean;
  checkoutUrl?: string;
  message?: string;
}

export interface ReservationResponse {
  success: boolean;
  message?: string;
  transaction?: any;
  isFreeOffer?: boolean;
}

export const createCheckoutSession = async (offerId: number): Promise<CheckoutResponse | null> => {
  try {
    const response = await api.post(`/payments/checkout/${offerId}`);
    
    if (response.data.success) {
      if (response.data.isFreeOffer) {
        return {
          isFreeOffer: true,
          message: response.data.message
        };
      }
      
      if (response.data.checkoutUrl) {
        return {
          isFreeOffer: false,
          checkoutUrl: response.data.checkoutUrl
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement:', error);
    return null;
  }
};

export const reserveOffer = async (offerId: number): Promise<ReservationResponse | null> => {
  try {
    const response = await api.post(`/payments/reserve/${offerId}`);
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la réservation de l\'offre:', error);
    return null;
  }
};

export const confirmReservation = async (transactionId: number): Promise<ReservationResponse | null> => {
  try {
    const response = await api.post(`/payments/reservations/${transactionId}/confirm`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la confirmation de la réservation:', error);
    return null;
  }
};

export const cancelReservation = async (transactionId: number): Promise<boolean> => {
  try {
    const response = await api.post(`/payments/reservations/${transactionId}/cancel`);
    return response.data.success === true;
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    return false;
  }
};

export const confirmTransaction = async (transactionId: number): Promise<boolean> => {
  try {
    const response = await api.post(`/payments/transactions/${transactionId}/confirm`);
    return response.data.success === true;
  } catch (error) {
    console.error('Erreur lors de la confirmation de la transaction:', error);
    return false;
  }
};

export const checkPaymentSuccess = async (offerId: number, sessionId: string): Promise<boolean> => {
  try {
    const response = await api.get(`/payments/success/${offerId}?session_id=${sessionId}`);
    return response.data.success === true;
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    return false;
  }
};

export const generateQrCode = async (transactionId: number): Promise<{token: string, expiresAt: string} | null> => {
  try {
    const response = await api.post(`/payments/transactions/${transactionId}/generate-qr`);
    if (response.data.success) {
      return {
        token: response.data.token,
        expiresAt: response.data.expiresAt
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error);
    return null;
  }
};

export const verifyQrCode = async (token: string): Promise<any> => {
  try {
    const response = await api.post('/payments/verify-qr', { token });
    return response.data.success ? response.data : null;
  } catch (error) {
    console.error('Erreur lors de la vérification du QR code:', error);
    return null;
  }
};

export const completeTransactionByQrCode = async (transactionId: number): Promise<boolean> => {
  try {
    const response = await api.post(`/payments/transactions/${transactionId}/complete-by-qr`);
    return response.data.success === true;
  } catch (error) {
    console.error('Erreur lors de la finalisation de la transaction par QR code:', error);
    return false;
  }
};
