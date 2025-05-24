import React, { useState, useRef, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import {
    messagesAtom,
    isSendingMessageAtom
} from '@/atoms/messages';
import { sendMessage, getPredefinedMessages } from '../../api/Message';
import { Send, Image as ImageIcon, SmilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PredefinedMessageSelector from './PredefinedMessageSelector';
import { ImagePreview } from './ImagePreview';

interface MessageInputProps {
    conversationId: number;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const setMessages = useSetAtom(messagesAtom);
    const [isSending, setIsSending] = useAtom(isSendingMessageAtom);
    const [showPredefined, setShowPredefined] = useState(false);
    const [predefinedMessages, setPredefinedMessages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchPredefinedMessages = async () => {
            try {
                const data = await getPredefinedMessages();
                setPredefinedMessages(data);
            } catch (error) {
                console.error('Failed to fetch predefined messages:', error);
            }
        };

        fetchPredefinedMessages();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newImages: File[] = [];

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert('Veuillez sélectionner uniquement des images valides');
                return;
            }

            if (file.size > 20 * 1024 * 1024) {
                alert(`L'image ${file.name} est trop volumineuse. Maximum 20 Mo.`);
                return;
            }

            newImages.push(file);
        });

        setImages(prevImages => [...prevImages, ...newImages]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if ((!content || content.trim() === '') && images.length === 0) {
            return;
        }

        setIsSending(true);

        try {
            const newMessage = await sendMessage(
                conversationId,
                content,
                images.length > 0 ? images : undefined
            );

            setMessages(prev => {
                const existingMessages = prev[conversationId] || [];
                return {
                    ...prev,
                    [conversationId]: [...existingMessages, newMessage]
                };
            });

            setContent('');
            setImages([]);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handlePredefinedSelect = (message: string) => {
        setContent(message);
        setShowPredefined(false);
    };

    const removeImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            {images.length > 0 && (
                <ImagePreview
                    images={images}
                    onRemove={removeImage}
                />
            )}

            <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                <Input
                    type="text"
                    placeholder="Tapez votre message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                <div className="flex items-center px-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPredefined(!showPredefined)}
                        className="text-gray-500 hover:text-purple-dark"
                    >
                        <SmilePlus className="h-5 w-5" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-500 hover:text-purple-dark"
                    >
                        <ImageIcon className="h-5 w-5" />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                            multiple
                        />
                    </Button>

                    <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        disabled={isSending || ((!content || content.trim() === '') && images.length === 0)}
                        className="text-purple-dark opacity-90 hover:opacity-100 disabled:opacity-50"
                    >
                        {isSending ? (
                            <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {showPredefined && (
                <PredefinedMessageSelector
                    messages={predefinedMessages}
                    onSelect={handlePredefinedSelect}
                    onClose={() => setShowPredefined(false)}
                />
            )}
        </form>
    );
};

export default MessageInput;