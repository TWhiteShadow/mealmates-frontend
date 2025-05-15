import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import {
    messagesAtom,
    isSendingMessageAtom
} from '@/atoms/messages';
import { sendMessage, getPredefinedMessages } from '../../api/Message';
import { Send, Image, SmilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PredefinedMessageSelector from './PredefinedMessageSelector';
import ImagePreview from './ImagePreview';

interface MessageInputProps {
    conversationId: number;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [messages, setMessages] = useAtom(messagesAtom);
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
        const file = e.target.files?.[0];
        if (file) {
            // Vérification du type de fichier
            if (!file.type.startsWith('image/')) {
                alert('Veuillez sélectionner une image valide');
                return;
            }

            // Vérification de la taille (max 5Mo)
            if (file.size > 5 * 1024 * 1024) {
                alert('L\'image est trop volumineuse. Maximum 5 Mo.');
                return;
            }

            setImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if ((!content || content.trim() === '') && !image) {
            return;
        }

        setIsSending(true);

        try {
            const newMessage = await sendMessage(conversationId, content, image || undefined);

            // Mettre à jour l'état local des messages
            setMessages(prev => {
                const existingMessages = prev[conversationId] || [];
                return {
                    ...prev,
                    [conversationId]: [...existingMessages, newMessage]
                };
            });

            // Réinitialiser le formulaire
            setContent('');
            setImage(null);

            // Réinitialiser l'input de fichier
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

    const removeImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            {image && (
                <ImagePreview
                    image={image}
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
                        <Image className="h-5 w-5" />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </Button>

                    <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        disabled={isSending || ((!content || content.trim() === '') && !image)}
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