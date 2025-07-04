import React, { useEffect, useState } from 'react';

import ConversationList from '../components/Messages/ConversationList';
import Conversation from '../components/Messages/Conversation';
import NotificationList from '@/components/Messages/NotificationList';
import { useAtom, useAtomValue } from 'jotai';
import {
    selectedConversationIdAtom,
    unreadMessagesCountAtom,
} from '@/atoms/messages';
import { activeTabAtom, unreadNotificationsCountAtom } from '@/atoms/notifications';
import ProfileAppBar from '@/components/ProfileAppBar';
import {
    Bell,
    MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router';

const MessagesPage: React.FC = () => {
    const [selectedId, setSelectedId] = useAtom(selectedConversationIdAtom);
    const unreadMessagesCount = useAtomValue(unreadMessagesCountAtom);
    const unreadNotificationsCount = useAtomValue(unreadNotificationsCountAtom);
    const [activeTab, setActiveTab] = useAtom(activeTabAtom);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        // Handle window resize
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (searchParams.get('conversation')) {
            setActiveTab("messages")
            setSelectedId(parseInt(searchParams.get('conversation') || '0'));
            searchParams.delete('conversation');
            setSearchParams(searchParams);
        }
    }, [searchParams]);


    const isMobile = windowWidth < 768;



    return (
        <div className="h-screen relative bg-gray-100 overflow-hidden z-20">
            <ProfileAppBar>
                <div className='relative flex items-center size-full justify-center'>

                    <h1 className='font-bold text-xl'>
                        {activeTab === 'messages' ? 'Messages' : 'Notifications'}
                    </h1>
                </div>
            </ProfileAppBar>

            <div className="max-w-6xl mx-auto px-4 pb-20 pt-6">
                <div className="flex justify-center mb-4 bg-white rounded-full shadow p-1">
                    <div className="grid grid-cols-2 w-full max-w-md">
                        <button
                            onClick={() => setActiveTab('messages')}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2 px-4 rounded-full transition-all",
                                activeTab === 'messages'
                                    ? "bg-purple-dark text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            <MessageSquare />
                            <span>Messages</span>
                            {unreadMessagesCount > 0 && (
                                <span className={cn(
                                    "text-xs text-purple-dark rounded-full w-5 h-5 flex items-center justify-center",
                                    activeTab === 'messages' ? "bg-white" : "bg-purple-100"
                                )}>
                                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2 px-4 rounded-full transition-all",
                                activeTab === 'notifications'
                                    ? "bg-purple-dark text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            <Bell />
                            <span>Notifications</span>
                            {unreadNotificationsCount > 0 && (
                                <span className={cn(
                                    "text-xs text-purple-dark rounded-full w-5 h-5 flex items-center justify-center",
                                    activeTab === 'notifications' ? "bg-white" : "bg-purple-100"
                                )}>
                                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {activeTab === 'messages' ? (
                    isMobile ? (
                        selectedId ? <Conversation /> : <ConversationList />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <ConversationList />
                            </div>
                            <div className="md:col-span-2">
                                <Conversation />
                            </div>
                        </div>
                    )
                ) : (
                    <NotificationList />
                )}
            </div>
        </div>
    );
};

export default MessagesPage;