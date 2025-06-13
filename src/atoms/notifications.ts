import { atom } from 'jotai';
import { Notification } from '../api/Notification';

export const notificationsAtom = atom<Notification[]>([]);
export const unreadNotificationsCountAtom = atom<number>(0);
export const isLoadingNotificationsAtom = atom<boolean>(false);
export const activeTabAtom = atom<'messages' | 'notifications'>('messages');