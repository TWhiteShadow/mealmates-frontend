import React, { useEffect, useRef, useCallback } from 'react';
import { useAtom } from 'jotai';
import {
    conversationsAtom,
    messagesAtom,
    selectedConversationIdAtom,
    isLoadingMessagesAtom,
    isLoadingOlderMessagesAtom,
    hasMoreMessagesAtom
} from '@/atoms/messages';
import { getConversationMessages } from '../../api/Message';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserData } from "@/api/User";

const Conversation: React.FC = () => {
    const [selectedId, setSelectedId] = useAtom(selectedConversationIdAtom);
    const [conversations] = useAtom(conversationsAtom);
    const [messages, setMessages] = useAtom(messagesAtom);
    const [isLoading, setIsLoading] = useAtom(isLoadingMessagesAtom);
    const [isLoadingOlder, setIsLoadingOlder] = useAtom(isLoadingOlderMessagesAtom);
    const [hasMore, setHasMore] = useAtom(hasMoreMessagesAtom);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const previousMessageCountRef = useRef<number>(0);
    const previousScrollHeight = useRef<number>(0);
    const isFirstLoadRef = useRef<boolean>(true);
    const { data: userData } = useUserData();

    const MESSAGES_LIMIT = 150;

    useEffect(() => {
        previousMessageCountRef.current = 0;
        isFirstLoadRef.current = true;
        if (selectedId) {
            setHasMore(prev => ({ ...prev, [selectedId]: true }));
            setIsLoadingOlder(prev => ({ ...prev, [selectedId]: false }));
        }
    }, [selectedId, setHasMore, setIsLoadingOlder]);

    const selectedConversation = conversations.find(c => c.id === selectedId);
    const conversationMessages = selectedId ? messages[selectedId] || [] : [];

    const isNearBottom = () => {
        const container = messagesContainerRef.current;
        if (!container) return true;

        const threshold = 600;
        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
        return isAtBottom;
    };

    const scrollToBottom = (smooth: boolean = true) => {
        const container = messagesContainerRef.current;
        if (container) {
            if (smooth) {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            } else {
                container.scrollTop = container.scrollHeight;
            }
        }
    };

    const loadOlderMessages = useCallback(async () => {
        if (!selectedId || isLoadingOlder[selectedId] || !hasMore[selectedId]) return;

        setIsLoadingOlder(prev => ({ ...prev, [selectedId]: true }));

        try {
            const currentMessages = conversationMessages.length;
            const olderMessages = await getConversationMessages(selectedId, MESSAGES_LIMIT, currentMessages);
            // Messages are returned in DESC order, so need to sort them in ASC order
            const sortedOlderMessages = olderMessages.sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );

            if (olderMessages.length < MESSAGES_LIMIT) {
                setHasMore(prev => ({ ...prev, [selectedId]: false }));
            }

            if (sortedOlderMessages.length > 0) {
                setMessages(prev => ({
                    ...prev,
                    [selectedId]: [...sortedOlderMessages, ...(prev[selectedId] || [])]
                }));
            }
        } catch (error) {
            console.error('Failed to load older messages:', error);
        } finally {
            setIsLoadingOlder(prev => ({ ...prev, [selectedId]: false }));
        }
    }, [selectedId, conversationMessages.length, isLoadingOlder, hasMore, setIsLoadingOlder, setHasMore, setMessages]);

    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container || !selectedId) return;

        // Check if we are near the top of the container
        if (container.scrollTop < 100 && hasMore[selectedId] && !isLoadingOlder[selectedId]) {
            previousScrollHeight.current = container.scrollHeight;
            loadOlderMessages();
        }
    }, [selectedId, hasMore, isLoadingOlder, loadOlderMessages]);

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
            try {
                const data = await getConversationMessages(selectedId, MESSAGES_LIMIT, 0);

                const sortedData = data.sort((a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );

                setMessages(prev => ({ ...prev, [selectedId]: sortedData }));

                // If < MESSAGES_LIMIT, we don't have more messages to load
                if (data.length < MESSAGES_LIMIT) {
                    setHasMore(prev => ({ ...prev, [selectedId]: false }));
                } else {
                    setHasMore(prev => ({ ...prev, [selectedId]: true }));
                }

            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                if (isFirstLoadRef.current) setIsLoading(false);
                isFirstLoadRef.current = false;
            }
        }

        fetchMessages();

        const pollInterval = setInterval(() => {
            // Only check for new messages (offset 0)
            if (!isFirstLoadRef.current) {
                getConversationMessages(selectedId, MESSAGES_LIMIT, 0).then(latestMessages => {
                    if (latestMessages.length > 0) {
                        const sortedLatestMessages = latestMessages.sort((a, b) =>
                            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        );

                        setMessages(prev => {
                            const currentMessages = prev[selectedId] || [];

                            if (currentMessages.length === 0) {
                                // If no current messages, set all latest messages
                                return { ...prev, [selectedId]: sortedLatestMessages };
                            }

                            // Find messages that exist on server but not locally
                            const currentMessageIds = new Set(currentMessages.map(msg => msg.id));
                            const newMessages = sortedLatestMessages.filter(msg =>
                                !currentMessageIds.has(msg.id)
                            );

                            if (newMessages.length > 0) {
                                // Merge and sort all messages to handle out-of-order scenarios
                                const allMessages = [...currentMessages, ...newMessages];
                                const sortedAllMessages = allMessages.sort((a, b) =>
                                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                                );

                                return {
                                    ...prev,
                                    [selectedId]: sortedAllMessages
                                };
                            }

                            return prev;
                        });
                    }
                }).catch(error => {
                    console.error('Failed to poll for new messages:', error);
                });
            }
        }, Number(import.meta.env.VITE_MESSAGES_POLL_INTERVAL) || 10000);

        return () => {
            clearInterval(pollInterval); // vu avec Hugo, evite effets de bord
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
        }
        else if (currentMessages > previousCount && isNearBottom()) {
            scrollToBottom(true);
        }

        previousMessageCountRef.current = currentMessages;
    }, [conversationMessages]);

    if (!selectedId || !selectedConversation) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-16rem)] bg-white rounded-lg">
                <p className="text-gray-400">Sélectionnez une conversation</p>
            </div>
        );
    }

    const otherParticipant = selectedConversation.buyer.id != userData?.id ? selectedConversation.buyer : selectedConversation.seller;

    return (
        <div className="flex flex-col h-[calc(100vh-16rem)] bg-white rounded-lg">
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden mr-2"
                        onClick={() => setSelectedId(null)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center">
                        <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-dark font-medium">
                                {otherParticipant ? otherParticipant.first_name.charAt(0) : '?'}
                            </span>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">
                                {otherParticipant ? `${otherParticipant.first_name} ${otherParticipant.last_name}` : 'Inconnu'}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {selectedConversation.offer.name} - {selectedConversation.offer.price}€
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {isLoadingOlder[selectedId] && (
                    <div className="flex justify-center py-4">
                        <div className="h-6 w-6 rounded-full border-2 border-purple-dark border-t-transparent animate-spin" />
                    </div>
                )}

                {isLoading && conversationMessages.length === 0 ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[70%] ${index % 2 === 0 ? 'bg-gray-100' : 'bg-purple-100'} rounded-lg p-3`}>
                                    <Skeleton className="h-4 w-40 mb-2" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    conversationMessages.map(message => (
                        <MessageItem
                            key={message.id}
                            message={message}
                            isFromCurrentUser={message.sender.id === userData?.id}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
                <MessageInput conversationId={selectedId} />
            </div>
        </div>
    );
};

export default Conversation;