import React, { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import {
    conversationsAtom,
    messagesAtom,
    selectedConversationIdAtom,
    isLoadingMessagesAtom
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const previousMessageCountRef = useRef<number>(0);
    const { data: userData } = useUserData();

    useEffect(() => {
        previousMessageCountRef.current = 0;
    }, [selectedId]);

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

    let isFirstLoad = true;

    useEffect(() => {
        if (!selectedId) return;

        const fetchMessages = async () => {
            if (isFirstLoad) setIsLoading(true);
            try {
                const data = await getConversationMessages(selectedId);
                setMessages(prev => ({ ...prev, [selectedId]: data }));

            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                if (isFirstLoad) setIsLoading(false);
                isFirstLoad = false;
            }
        }

        fetchMessages();

        const pollInterval = setInterval(fetchMessages, 1000);

        return () => {
            clearInterval(pollInterval);
        };
    }, [selectedId, setMessages]);


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