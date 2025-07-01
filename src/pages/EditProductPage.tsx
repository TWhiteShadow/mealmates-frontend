import { useParams, useNavigate } from 'react-router';
import { useProduct, type Product, type ProductFormData } from '@/api/Product';
import { Button } from '@/components/ui/button';
import ProfileAppBar from '@/components/ProfileAppBar';
import { ChevronLeft } from 'lucide-react';
import SellPageForm from '@/components/SellPage/SellPageForm';
import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { sellFormDataAtom } from '@/components/SellPage/atoms';
import { useAuthenticatedUserData } from '@/api/User';
import { toast } from 'sonner';

const convertProductToFormData = (product: Product): ProductFormData => {
    return {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        expiryDate: product.expiryDate,
        isRecurring: product.isRecurring,
        images: [], // Images will be handled separately
        allergens: product.allergens?.map(a => typeof a === 'object' ? a.id : a) || [],
        food_preferences: product.food_preferences?.map(p => typeof p === 'object' ? p.id : p) || [],
        address: product.pickupDetails ? parseInt(product.pickupDetails) : undefined,
    };
};

export default function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading: productLoading, error: productError } = useProduct(Number(id));
    const { data: user, isLoading: userLoading, error: userError } = useAuthenticatedUserData();
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const setFormData = useSetAtom(sellFormDataAtom);

    useEffect(() => {
        const initializeForm = async () => {
            if (product && product.images) {
                setIsLoadingImages(true);
                try {
                    // Convert each image URL to base64
                    const imagePromises = product.images.map(async (img) => {
                        const imgUrl = `${import.meta.env.VITE_BACKEND_URL}/images/files/${img.name}`;
                        const response = await fetch(imgUrl);
                        const blob = await response.blob();
                        return new Promise<{ name: string; mimeType: string; data: string }>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                resolve({
                                    name: img.name,
                                    mimeType: blob.type || 'image/jpeg',
                                    data: reader.result?.toString().split(',')[1] || '',
                                });
                            };
                            reader.readAsDataURL(blob);
                        });
                    });

                    const loadedImages = await Promise.all(imagePromises);
                    const formData = convertProductToFormData(product);
                    formData.images = loadedImages;
                    setFormData(formData);
                } catch (error) {
                    console.error('Failed to load images:', error);
                } finally {
                    setIsLoadingImages(false);
                }
            } else if (product) {
                const formData = convertProductToFormData(product);
                setFormData(formData);
            }
        };

        initializeForm();
    }, [product, setFormData]);

    const isLoading = productLoading || userLoading || isLoadingImages;
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark"></div>
            </div>
        );
    }

    if (productError || !product || userError || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">Impossible de charger le produit</p>
            </div>
        );
    }

    // Verify the current user is the product owner
    if (product.seller.id !== user.id) {
        navigate(`/app/product/${id}`);
        toast.error("Vous n'êtes pas autorisé à modifier cette offre.");
        return null;
    }

    return (
        <div className="min-h-screen pb-20 bg-gray-50">
            <ProfileAppBar>
                <div className='relative flex items-center size-full justify-center'>
                    <Button
                        variant="ghost"
                        className='absolute left-3 p-1'
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className='size-8 text-purple-dark' />
                    </Button>
                    <h1 className='font-bold text-xl'>Modifier votre offre</h1>
                </div>
            </ProfileAppBar>

            <div className="max-w-2xl mx-auto px-4 py-8">
                <SellPageForm mode="edit" productId={Number(id)} />
            </div>
        </div>
    );
}
