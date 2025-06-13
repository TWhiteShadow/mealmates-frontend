import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { notificationsAtom, unreadNotificationsCountAtom, isLoadingNotificationsAtom } from '@/atoms/notifications';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, Notification } from '@/api/Notification';
import NotificationItem from './NotificationItem';
import { Button } from '@/components/ui/button';

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [unreadCount, setUnreadCount] = useAtom(unreadNotificationsCountAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingNotificationsAtom);

  useEffect(() => {
    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      const unreadNotificationsCount = data.filter(n => !n.isRead).length;
      setUnreadCount(unreadNotificationsCount);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification.id);

        setNotifications(prevNotifications =>
          prevNotifications.map(n =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Erreur lors du marquage de la notification comme lue', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(n => ({ ...n, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues', error);
    }
  };

  const renderLoadingState = () => (
    <div className="flex justify-center items-center h-60">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-dark"></div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">Aucune notification</h3>
      <p className="mt-1 text-sm text-gray-500">
        Vous serez informé lorsque vous recevrez des nouvelles concernant vos offres ou messages.
      </p>
    </div>
  );

  const renderNotifications = () => (
    <>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold text-lg">Notifications</h2>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            onClick={handleMarkAllAsRead}
            className="text-sm text-purple-dark hover:text-purple-dark/80"
          >
            Marquer tout comme lu
          </Button>
        )}
      </div>
      <div className="max-h-[70vh] overflow-y-auto">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={handleNotificationClick}
          />
        ))}
      </div>
    </>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {isLoading ? renderLoadingState() : 
       notifications.length > 0 ? renderNotifications() : renderEmptyState()}
    </div>
  );
};

export default NotificationList;