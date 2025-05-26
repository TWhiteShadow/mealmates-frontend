import { atom } from 'jotai';
import { ConversationPreview, Message } from '../api/Message';

export const conversationsAtom = atom<ConversationPreview[]>([]);
export const selectedConversationIdAtom = atom<number | null>(null);
export const messagesAtom = atom<Record<number, Message[]>>({});
export const unreadCountAtom = atom<number>(0);

export const isLoadingConversationsAtom = atom<boolean>(false);
export const isLoadingMessagesAtom = atom<boolean>(false);
export const isSendingMessageAtom = atom<boolean>(false);

export const isLoadingOlderMessagesAtom = atom<Record<number, boolean>>({});
export const hasMoreMessagesAtom = atom<Record<number, boolean>>({});

export const messageImageBlobsAtom = atom<Record<string, string>>({});
// Helper function to generate a unique key for an image blob
export const generateImageBlobKey = (messageId: number, imageIndex: number) =>
  `${messageId}-${imageIndex}`;
