import { User } from '@/api/User';
import api from './Axios';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

export type Review = {
  id: number;
  reviewer: User;
  reviewed: User;
  status: 'pending' | 'approved' | 'rejected' | 'need_verification';
  productQualityRating?: number;
  appointmentRespectRating: number;
  friendlinessRating: number;
  averageRating: number;
  offer: {
    id: number;
    name: string;
  }
  createdAt: string;
};

export interface ReviewData {
  productQualityRating?: number;
  appointmentRespectRating: number;
  friendlinessRating: number;
}

export interface ReportData {
  reason: string;
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

export async function getUserReviews(
  userId: number,
  limit: number = 150,
  offset: number = 0
): Promise<Review[]> {
  const response = await api.get(
    `/users/${userId}/reviews?limit=${limit}&offset=${offset}`
  );
  return response.data;
}

export function useUserReviews(userId: number, limit: number = 5, offset: number = 0, isLoading?: boolean) {
  return useQuery({
    queryKey: ['userReviews', userId, limit, offset],
    queryFn: () => getUserReviews(userId, limit, offset),
    enabled: !isLoading && userId > 0,
  });
}

export async function reportReview(reviewId: number, reportData: ReportData) {
  const response = await api.post(`/reviews/${reviewId}/report`, reportData);
  return response.data;
}

export function useReportReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      reportData,
    }: {
      reviewId: number;
      reportData: ReportData;
    }) => reportReview(reviewId, reportData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userReviews'] });
    },
  });
}
