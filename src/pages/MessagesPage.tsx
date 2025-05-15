import React, { useEffect, useState } from 'react';
import ConversationList from '../components/Messages/ConversationList';
import Conversation from '../components/Messages/Conversation';
import { useAtom } from 'jotai';
import {
    selectedConversationIdAtom,
    unreadCountAtom,
    mercureConnectedAtom
} from '@/atoms/messages';
import { getUnreadMessagesCount } from '../api/Message';
import ProfileAppBar from '@/components/ProfileAppBar';
import { ArrowBackIosOutlined, CircleNotificationsOutlined } from '@mui/icons-material';
import { Button } from '@/components/ui/button';

const MessagesPage: React.FC = () => {
    const [selectedId] = useAtom(selectedConversationIdAtom);
    const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
    const [connected, setConnected] = useAtom(mercureConnectedAtom);
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

        // Interroger le serveur toutes les 30 secondes pour les messages non lus
        const intervalId = setInterval(fetchUnreadCount, 30000);
        // Configurer Mercure pour les notifications en temps réel
        const setupMercureNotifications = () => {
            const url = new URL(`${import.meta.env.VITE_MERCURE_PUBLIC_URL}`);
            // S'abonner aux notifications spécifiques à l'utilisateur
            const userId = localStorage.getItem('userId');
            url.searchParams.append('topic', `/api/v1/user/${userId}/messages`);

            const eventSource = new EventSource(url.toString(), { withCredentials: true });

            eventSource.onopen = () => {
                setConnected(true);
                console.log('Mercure connection opened');
            };

            eventSource.onerror = () => {
                setConnected(false);
                console.error('Mercure connection error');
            };

            eventSource.onmessage = event => {
                try {
                    const data = JSON.parse(event.data);

                    // Si c'est une mise à jour du statut de lecture, ignorer pour ce composant
                    if (data.type === 'read_status_update') {
                        return;
                    }

                    // Sinon, rafraîchir le compteur de messages non lus
                    fetchUnreadCount();
                } catch (error) {
                    console.error('Error parsing Mercure event:', error);
                }
            };

            return eventSource;
        };

        const eventSource = setupMercureNotifications();

        // Gérer le redimensionnement de la fenêtre
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(intervalId);
            eventSource.close();
            window.removeEventListener('resize', handleResize);
        };
    }, [setUnreadCount, setConnected]);

    // Affichage pour les mobiles: soit la liste soit la conversation
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

                    {!connected && (
                        <div className="absolute right-3 flex items-center">
                            <span className="text-yellow-600 text-xs mr-1">Hors ligne</span>
                            <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                        </div>
                    )}
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