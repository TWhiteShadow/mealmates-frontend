import React from 'react';
import { Message } from '../../api/Message';
import { useAtomValue } from 'jotai';
import { messageImageBlobsAtom, generateImageBlobKey } from '@/atoms/messages';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { ZoomableImage } from '../ZoomableImage';

dayjs.locale('fr');

interface MessageItemProps {
    message: Message;
    isFromCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isFromCurrentUser }) => {
    const messageImageBlobs = useAtomValue(messageImageBlobsAtom);

    const getImageSrc = (image: any, index: number) => {
        const blobKey = generateImageBlobKey(message.id, index);
        const blobUrl = messageImageBlobs[blobKey];
        if (blobUrl) {
            return blobUrl;
        } else {
            return `${import.meta.env.VITE_BACKEND_URL}/images/files/${image.name}`;
        }
    };


    return (
        <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-lg p-3 ${isFromCurrentUser
                    ? 'bg-purple-dark text-white'
                    : 'bg-gray-100 text-gray-800'
                    }`}
            >
                {(message.images && message.images.length > 0) && (
                    <div className="mb-2 space-y-2">
                        {message.images.map((image, index) => (
                            <ZoomableImage
                                key={index}
                                src={getImageSrc(image, index)}
                                alt={`Uploaded ${index + 1}`}
                                className="rounded-lg max-h-64 w-auto"
                            />
                        ))}
                    </div>
                )}

                {message.content && (
                    <p className="break-words">{message.content}</p>
                )}

                <div className={`text-xs mt-1 ${isFromCurrentUser ? 'text-purple-100' : 'text-gray-500'}`}>
                    {dayjs(message.createdAt).format('HH:mm')}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;