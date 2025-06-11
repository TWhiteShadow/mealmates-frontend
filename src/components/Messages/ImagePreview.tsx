import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SingleImagePreviewProps {
    image: File;
    onRemove: () => void;
}

const SingleImagePreview: React.FC<SingleImagePreviewProps> = ({ image, onRemove }) => {
    const imageUrl = URL.createObjectURL(image);
    return (
        <div className="mb-2 relative inline-block mr-2">
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

interface ImagePreviewProps {
    images: File[];
    onRemove: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onRemove }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-2">
            {images.map((image, index) => (
                <SingleImagePreview
                    key={`${image.name}-${index}`}
                    image={image}
                    onRemove={() => onRemove(index)}
                />
            ))}
        </div>
    );
};

export { ImagePreview };