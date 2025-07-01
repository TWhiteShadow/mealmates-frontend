import axios from './Axios';
import { useQuery } from '@tanstack/react-query';

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  tier: number;
  unlockedAt: string | null;
  isUnlocked: boolean;
  type?: string;
  threshold?: number;
}

export interface ProgressData {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  percentage: number;
  nextBadgeId: number | null;
  nextBadgeName: string | null;
}

export interface Credit {
  balance: number;
  lifetimeEarned: number;
}

export interface GamificationNotification {
  id: number;
  type: 'badge' | 'credit';
  title: string;
  description: string;
  value?: number;
  badgeId?: number;
  badgeIcon?: string;
  badgeCategory?: string;
  createdAt: string;
  isRead: boolean;
}

export const useUserBadges = (userId: number) => {
  return useQuery({
    queryKey: ['userBadges', userId],
    queryFn: async () => {
      const { data } = await axios.get<Badge[]>(`/users/${userId}/badges`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useUserProgress = (userId: number) => {
  return useQuery({
    queryKey: ['userProgress', userId],
    queryFn: async () => {
      const { data } = await axios.get<ProgressData[]>(`/users/${userId}/progress`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useUserCredits = (userId: number) => {
  return useQuery({
    queryKey: ['userCredits', userId],
    queryFn: async () => {
      const { data } = await axios.get<Credit>(`/users/${userId}/credits`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useGamificationHistory = (userId: number, limit: number = 10, offset: number = 0) => {
  return useQuery({
    queryKey: ['gamificationHistory', userId, limit, offset],
    queryFn: async () => {
      const { data } = await axios.get<GamificationNotification[]>(
        `/users/${userId}/gamification-history`,
        {
          params: {
            limit,
            offset,
          },
        }
      );
      return data;
    },
    enabled: !!userId,
  });
};
