import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAtom } from 'jotai';
import { sellFormDataAtom } from './atoms';
import { ProductFormData } from '@/api/Product';

const ImageUploadStep = () => {
    const [formData, setFormData] = useAtom(sellFormDataAtom);
    const [images, setImages] = useState<Array<{
        name: string;
        mimeType: string;
        data: string;
    }>>(formData.images || []);
    const { setValue } = useFormContext<ProductFormData>();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const newImages = Array.from(e.target.files).map(file => {
            return new Promise<{
                name: string;
                mimeType: string;
                data: string;
            }>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result?.toString().split(',')[1] || '';
                    resolve({
                        name: file.name,
                        mimeType: file.type,
                        data: base64
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newImages).then((imageResults) => {
            const updatedImages = [...images, ...imageResults];
            setImages(updatedImages);
            setFormData({ ...formData, images: updatedImages });
            setValue('images', updatedImages);
        });
    };

    const removeImage = (index: number) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
        setFormData({ ...formData, images: updatedImages });
        setValue('images', updatedImages);
    };

    useEffect(() => {
        if (formData.images && formData.images.length > 0) {
            setImages(formData.images);
            setValue('images', formData.images);
        }
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Photos du produit</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="image-upload"
                    className="hidden"
                    onChange={handleImageUpload}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="space-y-2">
                        <div className="flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-600">Cliquez pour ajouter des photos</p>
                        <p className="text-xs text-gray-400">JPG, PNG, etc. Max 5MB</p>
                    </div>
                </label>
            </div>

            {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={`data:${image.mimeType};base64,${image.data}`}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                onClick={() => removeImage(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploadStep;
