import React, { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import {
    conversationsAtom,
    messagesAtom,
    selectedConversationIdAtom,
    isLoadingMessagesAtom
} from '@/atoms/messages';
import { getConversation, markConversationAsRead } from '../../api/Message';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Conversation: React.FC = () => {
    const [selectedId, setSelectedId] = useAtom(selectedConversationIdAtom);
    const [conversations] = useAtom(conversationsAtom);
    const [messages, setMessages] = useAtom(messagesAtom);
    const [isLoading, setIsLoading] = useAtom(isLoadingMessagesAtom);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userId = localStorage.getItem('userId');

    const selectedConversation = conversations.find(c => c.id === selectedId);
    const conversationMessages = selectedId ? messages[selectedId] || [] : [];

    // Function to scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!selectedId) return;

        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const data = await getConversation(selectedId);
                setMessages(prev => ({ ...prev, [selectedId]: data.messages }));

                // Mark conversation as read
                await markConversationAsRead(selectedId);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Initial fetch
        fetchMessages();

        // Poll for new messages every 5 seconds for active conversations
        const pollInterval = setInterval(fetchMessages, 60000);

        return () => {
            clearInterval(pollInterval);
        };
    }, [selectedId, setMessages, setIsLoading]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [conversationMessages]);

    if (!selectedId || !selectedConversation) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-16rem)] bg-white rounded-lg">
                <p className="text-gray-400">Sélectionnez une conversation</p>
            </div>
        );
    }

    const otherParticipant = selectedConversation.buyer;

    return (
        <div className="flex flex-col h-[calc(100vh-16rem)] bg-white rounded-lg">
            {/* Header */}
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                            isFromCurrentUser={message.sender.id.toString() === userId}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
                <MessageInput conversationId={selectedId} />
            </div>
        </div>
    );
};

export default Conversation;