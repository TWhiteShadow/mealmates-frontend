import api from './Axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface UserReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface ReportReviewRequest {
  reviewId: number;
  reason: string;
  description?: string;
}

export interface ReportResponse {
  success: boolean;
  message: string;
}

export async function getUserReviews(
  userId: number,
  limit: number = 5
): Promise<UserReview[]> {
  const response = await api.get(`/user/${userId}/reviews?limit=${limit}`);
  return response.data;
}

export function useUserReviews(userId: number, limit: number = 5) {
  return useQuery({
    queryKey: ['userReviews', userId, limit],
    queryFn: () => getUserReviews(userId, limit),
  });
}

export async function reportReview(reportData: ReportReviewRequest): Promise<ReportResponse> {
  const response = await api.post('/review/report', reportData);
  return response.data;
}

export function useReportReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportData: ReportReviewRequest) => reportReview(reportData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userReviews'] });
    },
  });
}
