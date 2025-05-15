import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImagePreviewProps {
    image: File;
    onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onRemove }) => {
    const imageUrl = URL.createObjectURL(image);

    return (
        <div className="mb-2 relative inline-block">
            <img
                src={imageUrl}
                alt="Preview"
                className="max-h-32 rounded-lg"
                onLoad={() => URL.revokeObjectURL(imageUrl)}
            />
            <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={onRemove}
                className="absolute -top-2 -right-2 h-6 w-6"
            >
                <X className="h-3 w-3" />
            </Button>
        </div>
    );
};

export default ImagePreview;