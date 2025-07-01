import { useParams, useNavigate } from 'react-router';
import { useProduct, useDeleteProductMutation } from '@/api/Product';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import ProfileAppBar from '@/components/ProfileAppBar';
import { cn } from "@/lib/utils";
import ContactSellerButton from '@/components/ProductPage/ContactSellerButton';
import { useUserData } from '@/api/User';
import logo from '@/assets/MealMatesLogo.webp';
import { ChevronLeft, CircleCheckBig, Clock, Pencil, Star, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UserProfileLink from '@/components/UserProfileLink';

dayjs.locale('fr');

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useProduct(Number(id));
    const { data: user } = useUserData();
    const deleteProduct = useDeleteProductMutation();

    const handleDelete = async () => {
        await deleteProduct.mutateAsync(Number(id));
        navigate('/app/profile');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">Failed to load product details</p>
            </div>
        );
    }

    const isExpiringSoon = !product.soldAt && dayjs(product.expiryDate).diff(dayjs(), 'day') <= 1;
    const formattedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <ProfileAppBar>
                <div className='relative flex items-center size-full justify-center'>
                    <Button
                        variant="ghost"
                        className='absolute left-3 p-1'
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className='size-8 text-purple-dark' />
                    </Button>
                    <h1 className='font-bold text-xl'>{product.name}</h1>
                </div>
            </ProfileAppBar>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                    {/* Images */}
                    <div className="size-full">
                        {product.images && product.images.length > 0 ? (
                            <div className="relative">
                                {!product.soldAt && isExpiringSoon && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                            <Clock className='mr-1' size={16} /> Bientôt fini
                                        </span>
                                    </div>
                                )}
                                {product.soldAt && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            <CircleCheckBig className='mr-1' size={16} /> Vendu
                                        </span>
                                    </div>
                                )}
                                <Carousel className="w-full max-w-xl"
                                    opts={{
                                        loop: true,
                                    }}

                                >
                                    <CarouselContent>
                                        {product.images.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <div className="aspect-square relative overflow-hidden rounded-xl">
                                                    <img
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/images/files/${image.name}`}
                                                        alt={`${product.name} - Image ${index + 1}`}
                                                        className="size-full object-cover"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="left-2" />
                                    <CarouselNext className="right-2" />
                                </Carousel>
                            </div>
                        ) : (
                            <div className='size-full aspect-square bg-purple-100 rounded-lg flex items-center justify-center'>
                                <img src={logo} alt="" className='w-1/3' />
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <div className='flex flex-col-reverse gap-4 lg:flex-col'>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                                    <UserProfileLink
                                        user={product.seller}
                                    >
                                        <div className='flex items-center flex-nowrap'>
                                            <span className='text-gray-600'>{product.seller.first_name || ''} {product.seller.last_name || ''}</span>
                                            {product.seller.averageRating && (
                                                <span className="ml-2 text-gray-500 text-sm flex items-center flex-nowrap">
                                                    {product.seller.averageRating.toFixed(2)}
                                                    <Star className='fill-purple-semi-dark stroke-purple-dark w-3 ml-0.5' />
                                                </span>
                                            )}
                                        </div>
                                    </UserProfileLink>
                                </div>
                                <p className="text-3xl font-bold text-purple-semi-dark">{formattedPrice == "0,00 €" ? "Don" : formattedPrice}</p>
                            </div>
                            {product.soldAt && (
                                <div className="text-sm text-gray-500">
                                    <span className="font-semibold text-green-600 text-xl">Ce produit à été vendu le {dayjs(product.soldAt).format('DD MMMM YYYY')} à {product.buyer?.first_name + " " + product.buyer?.last_name}</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <div className="text-sm font-medium text-gray-900">Description</div>
                            <p className="mt-2 text-base text-gray-700">{product.description}</p>
                        </div>

                        <div className="mt-6 space-y-6">
                            <div>
                                <div className="text-sm font-medium text-gray-900">Expiration</div>
                                <p className={cn(
                                    "mt-2 text-sm",
                                    isExpiringSoon ? "text-red-600 font-semibold" : "text-gray-700"
                                )}>
                                    {dayjs(product.expiryDate).format('DD MMMM YYYY')}
                                    {isExpiringSoon && ' (Bientôt expiré)'}
                                </p>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-900">Quantité</div>
                                <p className="mt-2 text-sm text-gray-700">{product.quantity}</p>
                            </div>

                            {product.food_preferences && product.food_preferences.length > 0 && (
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Préférences alimentaires</div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.food_preferences.map((pref) => (
                                            <span
                                                key={typeof pref === 'object' ? pref.id : pref}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                            >
                                                {typeof pref === 'object' ? pref.name : pref}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.allergens && product.allergens.length > 0 && (
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Allergènes</div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.allergens.map((allergen) => (
                                            <span
                                                key={typeof allergen === 'object' ? allergen.id : allergen}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                            >
                                                {typeof allergen === 'object' ? allergen.name : allergen}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            {!product.soldAt && (
                                product.seller?.id === user?.id ? (
                                    <div className="flex gap-4">
                                        <Button
                                            variant="outline"
                                            className="flex-1 gap-2"
                                            onClick={() => navigate(`/app/product/${id}/edit`)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Modifier
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1 gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Supprimer
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action est irréversible. L'offre sera définitivement supprimée.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleDelete}
                                                        className="bg-destructive hover:bg-destructive/90"
                                                    >
                                                        Supprimer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ) : (
                                    <ContactSellerButton
                                        offerId={product.id}
                                        sellerId={product.seller.id}
                                        className="w-full text-white py-3 rounded-lg font-medium"
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}