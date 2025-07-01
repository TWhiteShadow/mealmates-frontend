import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PredefinedMessageSelectorProps {
    messages: string[];
    onSelect: (message: string) => void;
    onClose: () => void;
}

const PredefinedMessageSelector: React.FC<PredefinedMessageSelectorProps> = ({
    messages,
    onSelect,
    onClose
}) => {
    return (
        <div className="absolute bottom-full left-0 right-0 bg-white border rounded-lg shadow-lg p-2 mb-2 z-20">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Messages prédéfinis</h3>
                <Button type="button" variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="max-h-48 overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className="py-2 px-3 hover:bg-gray-50 rounded cursor-pointer text-sm"
                        onClick={() => onSelect(message)}
                    >
                        {message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PredefinedMessageSelector;