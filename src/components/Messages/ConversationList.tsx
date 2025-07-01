import React from 'react';
import { useAtom } from 'jotai';
import { selectedConversationIdAtom } from '../../atoms/messages';
import { ConversationPreview, useConversations } from '../../api/Message';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserData } from '@/api/User';
import UserAvatar from '@/components/UserAvatar';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const ConversationList: React.FC = () => {
  const [selectedId, setSelectedId] = useAtom(selectedConversationIdAtom);
  const { data: userData } = useUserData();

  const { data: conversations = [], isLoading, error } = useConversations();

  const handleSelectConversation = (conversation: ConversationPreview) => {
    setSelectedId(conversation.id);
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className='overflow-y-auto h-[calc(100vh-14rem)] bg-white rounded-lg p-4 space-y-3'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className='flex items-center p-3 rounded-lg border border-gray-200'
          >
            <Skeleton className='h-12 w-12 rounded-full mr-3' />
            <div className='flex-1'>
              <Skeleton className='h-4 w-2/3 mb-2' />
              <Skeleton className='h-3 w-1/2' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='overflow-y-auto h-[calc(100vh-14rem)] bg-white rounded-lg p-4'>
        <div className='text-center py-10'>
          <p className='text-red-500 mb-4'>
            Erreur lors du chargement des conversations
          </p>
          <p className='text-sm text-gray-400'>Veuillez réessayer plus tard</p>
        </div>
      </div>
    );
  }

  if (!isLoading && conversations.length === 0) {
    return (
      <div className='overflow-y-auto h-[calc(100vh-14rem)] bg-white rounded-lg p-4'>
        <div className='text-center py-10'>
          <p className='text-gray-500 mb-4'>
            Vous n'avez pas encore de conversations
          </p>
          <p className='text-sm text-gray-400'>
            Commencez à discuter avec des vendeurs en navigant sur leurs offres
            et en cliquant sur "Contacter"
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className='overflow-y-auto h-[calc(100vh-14rem)] bg-white rounded-lg'>
      <div className='p-4 border-b border-gray-200'>
        <h2 className='text-lg font-semibold text-gray-800'>Messages</h2>
      </div>

      <div>
        {conversations.map((conversation) => {
          const otherParticipant =
            conversation.buyer.id != userData?.id
              ? conversation.buyer
              : conversation.seller;
          return (
            <div
              key={conversation.id}
              className={`p-4 flex items-center hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${selectedId === conversation.id ? 'bg-purple-50' : ''
                }`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <div className='flex-shrink-0'>
                {isLoading ? (
                  <Skeleton className='h-12 w-12 rounded-full' />
                ) : (
                  <UserAvatar user={otherParticipant} size="md" />
                )}
              </div>

              <div className='ml-4 flex-1'>
                <div className='flex justify-between'>
                  <h3 className='text-sm font-medium text-gray-900'>
                    {otherParticipant
                      ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                      : 'Inconnu'}
                  </h3>
                  <span className='text-xs text-gray-500'>
                    {dayjs(conversation.lastMessage?.createdAt).fromNow()}
                  </span>
                </div>

                <div className='flex items-center'>
                  <p className='text-sm text-gray-500 truncate max-w-xs'>
                    {conversation.offer.name} - {conversation.offer.dynamicPrice || conversation.offer.price}€
                  </p>
                </div>

                {conversation.lastMessage && (
                  <p className='text-xs text-gray-500 mt-1 line-clamp-3 break-all'>
                    {conversation.lastMessage.images &&
                      conversation.lastMessage.images.length > 0
                      ? '📷 Image'
                      : conversation.lastMessage.content}
                  </p>
                )}

                {conversation.unreadCount > 0 && (
                  <div className='mt-1'>
                    <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800'>
                      {conversation.unreadCount} non lu
                      {conversation.unreadCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
