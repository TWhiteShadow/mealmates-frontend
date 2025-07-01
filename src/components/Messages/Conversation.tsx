import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { useAtom } from 'jotai';
import {
  messagesAtom,
  selectedConversationIdAtom,
  isLoadingMessagesAtom,
  isLoadingOlderMessagesAtom,
  hasMoreMessagesAtom,
} from '@/atoms/messages';
import { getConversationMessages, useConversations } from '../../api/Message';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { ArrowLeft, ChevronsDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserData } from '@/api/User';
import OfferActions from './OfferActions';
import UserCardLink from '../UserCardLink';

const Conversation: React.FC = () => {
  const [selectedId, setSelectedId] = useAtom(selectedConversationIdAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingMessagesAtom);
  const [isLoadingOlder, setIsLoadingOlder] = useAtom(
    isLoadingOlderMessagesAtom
  );
  const [hasMore, setHasMore] = useAtom(hasMoreMessagesAtom);
  const [isNearBottomState, setIsNearBottomState] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef<number>(0);
  const previousScrollHeight = useRef<number>(0);
  const isFirstLoadRef = useRef<boolean>(true);
  const currentConversationIdRef = useRef<number | null>(null);
  const { data: userData } = useUserData();

  const { data: conversations = [] } = useConversations();

  const MESSAGES_LIMIT = 150;

  useEffect(() => {
    previousMessageCountRef.current = 0;
    isFirstLoadRef.current = true;
    currentConversationIdRef.current = selectedId;
    if (selectedId) {
      setHasMore((prev) => ({ ...prev, [selectedId]: true }));
      setIsLoadingOlder((prev) => ({ ...prev, [selectedId]: false }));
      setIsLoading(false);
    }
  }, [selectedId, setHasMore, setIsLoadingOlder, setIsLoading]);

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedId);
  }, [conversations, selectedId]);

  const conversationMessages = useMemo(() => {
    return selectedId ? messages[selectedId] || [] : [];
  }, [selectedId, messages]);

  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100;
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      threshold;
    return isAtBottom;
  }, []);

  const scrollToBottom = (smooth: boolean = true) => {
    const container = messagesContainerRef.current;
    if (container) {
      if (smooth) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  const loadOlderMessages = useCallback(async () => {
    if (!selectedId || isLoadingOlder[selectedId] || !hasMore[selectedId])
      return;

    setIsLoadingOlder((prev) => ({ ...prev, [selectedId]: true }));
    const conversationIdToFetch = selectedId;

    try {
      const currentMessages = conversationMessages.length;
      const olderMessages = await getConversationMessages(
        selectedId,
        MESSAGES_LIMIT,
        currentMessages
      );
      if (currentConversationIdRef.current !== conversationIdToFetch) return;

      const sortedOlderMessages = olderMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      if (olderMessages.length < MESSAGES_LIMIT) {
        setHasMore((prev) => ({ ...prev, [selectedId]: false }));
      }

      if (sortedOlderMessages.length > 0) {
        setMessages((prev) => ({
          ...prev,
          [selectedId]: [...sortedOlderMessages, ...(prev[selectedId] || [])],
        }));
      }
    } catch (error) {
      console.error('Failed to load older messages:', error);
    } finally {
      setIsLoadingOlder((prev) => ({ ...prev, [selectedId]: false }));
    }
  }, [
    selectedId,
    conversationMessages.length,
    isLoadingOlder,
    hasMore,
    setIsLoadingOlder,
    setHasMore,
    setMessages,
  ]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || !selectedId) return;

    setIsNearBottomState(isNearBottom());

    if (
      container.scrollTop < 100 &&
      hasMore[selectedId] &&
      !isLoadingOlder[selectedId]
    ) {
      previousScrollHeight.current = container.scrollHeight;
      loadOlderMessages();
    }
  }, [selectedId, hasMore, isLoadingOlder, loadOlderMessages, isNearBottom]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!selectedId) return;

    const fetchMessages = async () => {
      if (isFirstLoadRef.current) setIsLoading(true);
      const conversationIdToFetch = selectedId;
      try {
        const data = await getConversationMessages(
          selectedId,
          MESSAGES_LIMIT,
          0
        );
        if (currentConversationIdRef.current !== conversationIdToFetch) return;

        const sortedData = data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setMessages((prev) => ({ ...prev, [selectedId]: sortedData }));

        if (data.length < MESSAGES_LIMIT) {
          setHasMore((prev) => ({ ...prev, [selectedId]: false }));
        } else {
          setHasMore((prev) => ({ ...prev, [selectedId]: true }));
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        if (isFirstLoadRef.current) setIsLoading(false);
        isFirstLoadRef.current = false;
      }
    };

    fetchMessages();

    const pollInterval = setInterval(
      () => {
        if (
          !isFirstLoadRef.current &&
          currentConversationIdRef.current === selectedId
        ) {
          getConversationMessages(selectedId, MESSAGES_LIMIT, 0)
            .then((latestMessages) => {
              if (currentConversationIdRef.current !== selectedId) return;
              if (latestMessages.length > 0) {
                const sortedLatestMessages = latestMessages.sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                );

                setMessages((prev) => {
                  const currentMessages = prev[selectedId] || [];

                  if (currentMessages.length === 0) {
                    return { ...prev, [selectedId]: sortedLatestMessages };
                  }

                  const currentMessageIds = new Set(
                    currentMessages.map((msg) => msg.id)
                  );
                  const newMessages = sortedLatestMessages.filter(
                    (msg) => !currentMessageIds.has(msg.id)
                  );

                  if (newMessages.length > 0) {
                    const allMessages = [...currentMessages, ...newMessages];
                    const sortedAllMessages = allMessages.sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    );

                    return {
                      ...prev,
                      [selectedId]: sortedAllMessages,
                    };
                  }

                  return prev;
                });
              }
            })
            .catch((error) => {
              console.error('Failed to poll for new messages:', error);
            });
        }
      },
      Number(import.meta.env.VITE_MESSAGES_POLL_INTERVAL) || 10000
    );

    return () => {
      clearInterval(pollInterval);
    };
  }, [selectedId, setMessages, setHasMore]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !previousScrollHeight.current) return;

    const currentScrollHeight = container.scrollHeight;
    const scrollDifference = currentScrollHeight - previousScrollHeight.current;

    if (scrollDifference > 0) {
      container.scrollTop += scrollDifference;
      previousScrollHeight.current = 0;
    }
  }, [conversationMessages.length]);

  useEffect(() => {
    const currentMessages = conversationMessages.length;
    const previousCount = previousMessageCountRef.current;

    if (previousCount === 0 && currentMessages > 0) {
      scrollToBottom(false);
    } else if (currentMessages > previousCount && isNearBottom()) {
      scrollToBottom(true);
    }

    previousMessageCountRef.current = currentMessages;
  }, [conversationMessages]);

  if (!selectedId || !selectedConversation) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-14rem)] bg-white rounded-lg'>
        <p className='text-gray-400'>Sélectionnez une conversation</p>
      </div>
    );
  }

  const otherParticipant =
    selectedConversation.buyer.id != userData?.id
      ? selectedConversation.buyer
      : selectedConversation.seller;

  return (
    <div className='flex flex-col h-[calc(100vh-14rem)] bg-white rounded-lg'>
      <div className='p-4 border-b flex items-center justify-between'>
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden mr-2'
            onClick={() => setSelectedId(null)}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>

          <div className='flex items-center'>
            <UserCardLink
              user={otherParticipant}
              link={`/app/product/${selectedConversation.offer.id}`}
            >
              <div>
                <h3 className='text-sm font-medium text-gray-900'>
                  {otherParticipant
                    ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                    : 'Inconnu'}
                </h3>
                <p className='text-xs text-gray-500'>
                  {selectedConversation.offer.name} -{' '}
                  {selectedConversation.offer.dynamicPrice || selectedConversation.offer.price}€
                </p>
              </div>
            </UserCardLink>
          </div>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className='flex-1 overflow-y-auto p-4 space-y-4 relative'
        onScroll={handleScroll}
      >
        {isLoadingOlder[selectedId] && (
          <div className='flex justify-center py-4'>
            <div className='h-6 w-6 rounded-full border-2 border-purple-dark border-t-transparent animate-spin' />
          </div>
        )}

        {isLoading && conversationMessages.length === 0 ? (
          <div className='space-y-4'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`loading-skeleton-${selectedId}-${index}`}
                className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] ${index % 2 === 0 ? 'bg-gray-100' : 'bg-purple-100'} rounded-lg p-3`}
                >
                  <Skeleton className='h-4 w-40 mb-2' />
                  <Skeleton className='h-3 w-20' />
                </div>
              </div>
            ))}
          </div>
        ) : (
          conversationMessages.map((message) => (
            <MessageItem
              key={`conversation-${selectedId}-message-${message.id}`}
              message={message}
              isFromCurrentUser={message.sender.id === userData?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />

        {!isNearBottomState && (
          <div className='sticky bottom-4 right-4 z-10 flex justify-end'>
            <Button
              variant='outline'
              size='icon'
              className='bg-white shadow-lg hover:bg-gray-50 rounded-full'
              onClick={() => scrollToBottom(true)}
            >
              <ChevronsDownIcon className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
      <OfferActions
        product={selectedConversation.offer}
        transactions={selectedConversation.offer.transactions || []}
        otherParticipant={otherParticipant}
        selectedId={selectedId}
      />
      <div className='p-4 border-t'>
        <MessageInput conversationId={selectedId} />
      </div>
    </div>
  );
};

export default Conversation;
