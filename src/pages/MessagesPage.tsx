import React, { useEffect, useState } from 'react';
import ConversationList from '../components/Messages/ConversationList';
import Conversation from '../components/Messages/Conversation';
import { useAtom } from 'jotai';
import {
    selectedConversationIdAtom,
    unreadCountAtom,
} from '@/atoms/messages';
import { getUnreadMessagesCount } from '../api/Message';
import ProfileAppBar from '@/components/ProfileAppBar';
import { ArrowBackIosOutlined, CircleNotificationsOutlined } from '@mui/icons-material';
import { Button } from '@/components/ui/button';

const MessagesPage: React.FC = () => {
    const [selectedId] = useAtom(selectedConversationIdAtom);
    const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const count = await getUnreadMessagesCount();
                setUnreadCount(count);
            } catch (error) {
                console.error('Failed to fetch unread messages count:', error);
            }
        };

        fetchUnreadCount();

        const intervalId = setInterval(fetchUnreadCount, 1000);

        // Handle window resize
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', handleResize);
        };
    }, [setUnreadCount]);

    // Display for mobile: either the list or the conversation
    const isMobile = windowWidth < 768;

    return (
        <div className="h-screen relative bg-gray-100 overflow-hidden">
            <ProfileAppBar>
                <div className='relative flex items-center w-full h-full justify-center'>
                    <Button
                        variant="ghost"
                        className='absolute left-3 p-1'
                        onClick={() => window.history.back()}
                    >
                        <ArrowBackIosOutlined fontSize="small" />
                    </Button>
                    <h1 className='font-bold text-xl flex items-center'>
                        Messages
                        {unreadCount > 0 && (
                            <div className="ml-2 flex items-center">
                                <CircleNotificationsOutlined className="text-purple-dark" />
                                <span className="text-sm bg-purple-dark text-white rounded-full w-5 h-5 flex items-center justify-center -ml-1">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            </div>
                        )}
                    </h1>
                </div>
            </ProfileAppBar>

            <div className="max-w-6xl mx-auto px-4 pb-20 pt-6">
                {isMobile ? (
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
                )}
            </div>
        </div>
    );
};

export default MessagesPage;