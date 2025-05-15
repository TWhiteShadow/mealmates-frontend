import { atom } from 'jotai';
import { ConversationPreview, Message } from '../api/Message';

// État des conversations
export const conversationsAtom = atom<ConversationPreview[]>([]);
export const selectedConversationIdAtom = atom<number | null>(null);
export const messagesAtom = atom<Record<number, Message[]>>({});
export const unreadCountAtom = atom<number>(0);

// État de chargement
export const isLoadingConversationsAtom = atom<boolean>(false);
export const isLoadingMessagesAtom = atom<boolean>(false);
export const isSendingMessageAtom = atom<boolean>(false);

// Connexion Mercure
export const mercureConnectedAtom = atom<boolean>(false);
