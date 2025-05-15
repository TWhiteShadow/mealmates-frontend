import React from 'react';
import { Message } from '../../api/Message';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

// Initialize French locale
dayjs.locale('fr');

interface MessageItemProps {
    message: Message;
    isFromCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isFromCurrentUser }) => {
    return (
        <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-lg p-3 ${isFromCurrentUser
                    ? 'bg-purple-dark text-white'
                    : 'bg-gray-100 text-gray-800'
                    }`}
            >
                {message.imageFilename && (
                    <div className="mb-2">
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/messages/${message.imageFilename}`}
                            alt="Uploaded"
                            className="rounded-lg max-h-64 w-auto"
                            loading="lazy"
                        />
                    </div>
                )}

                {message.content && (
                    <p className="break-words">{message.content}</p>
                )}

                <div className={`text-xs mt-1 ${isFromCurrentUser ? 'text-purple-100' : 'text-gray-500'}`}>
                    {dayjs(message.sentAt).format('HH:mm')}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;