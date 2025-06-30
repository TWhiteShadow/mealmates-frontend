import { User } from '@/api/User';
import api from './Axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type Review = {
  id: number;
  reviewer: User;
  reviewed: User;
  status: 'pending' | 'approved' | 'rejected' | 'need_verification';
};

export interface ReviewData {
  productQualityRating?: number;
  appointmentRespectRating: number;
  friendlinessRating: number;
}

export async function submitTransactionReview(
  transactionId: number,
  reviewData: ReviewData
) {
  const response = await api.post(
    `/transactions/${transactionId}/reviews`,
    reviewData
  );
  return response.data;
}

export function useSubmitTransactionReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      transactionId,
      reviewData,
    }: {
      transactionId: number;
      reviewData: ReviewData;
    }) => submitTransactionReview(transactionId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', 'userStats', 'userData'],
      });
    },
  });
}
