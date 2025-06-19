import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { getOrCreateConversation } from '../../api/Message';
import { MessageCircle } from 'lucide-react';

interface ContactSellerButtonProps {
    offerId: number;
    sellerId: number;
    className?: string;
}

const ContactSellerButton: React.FC<ContactSellerButtonProps> = ({
    offerId,
    sellerId,
    className = '',
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleClick = async () => {
        setIsLoading(true);

        try {
            const conversation = await getOrCreateConversation(offerId, sellerId);
            navigate(`/app/messages?conversation=${conversation.id}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleClick}
            disabled={isLoading}
            className={`flex items-center gap-2 ${className}`}
        >
            {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
                <MessageCircle className="h-5 w-5" />
            )}
            Contacter le vendeur
        </Button>
    );
};

export default ContactSellerButton;