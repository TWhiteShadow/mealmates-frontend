import { useParams } from 'react-router';
import { useProduct } from '@/api/Product';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import ProfileAppBar from '@/components/ProfileAppBar';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { cn } from "@/lib/utils";
import ContactSellerButton from '@/components/ProductPage/ContactSellerButton';
import { useUserData } from '@/api/User';

dayjs.locale('fr');

export default function ProductPage() {
    const { id } = useParams();
    const { data: product, isLoading, error } = useProduct(Number(id));
    const { data: user } = useUserData();
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

    const isExpiringSoon = dayjs(product.expiryDate).diff(dayjs(), 'day') <= 3;
    const formattedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <ProfileAppBar>
                <div className='relative flex items-center w-full h-full justify-center'>
                    <Button
                        variant="ghost"
                        className='absolute left-3 p-1'
                        onClick={() => window.history.back()}
                    >
                        <ArrowBackIosOutlined fontSize="small" />
                    </Button>
                    <h1 className='font-bold text-xl'>{product.name}</h1>
                </div>
            </ProfileAppBar>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                    {/* Images */}
                    <div className="w-full">
                        {product.images && product.images.length > 0 ? (
                            <div className="relative">
                                {isExpiringSoon && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                            Ending soon
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
                                                        className="w-full h-full object-cover"
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
                            <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
                                <span className="text-gray-400">No image available</span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Par {product.seller?.first_name} {product.seller?.last_name?.[0]}.
                                </p>
                            </div>
                            <p className="text-3xl font-bold text-purple-semi-dark">{formattedPrice == "0,00 €" ? "Don" : formattedPrice}</p>
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

                        {/* <div className="mt-8 grid grid-cols-3 gap-4">
                            <StatCard
                                title="Personnel"
                                value="217"
                                unit="personnes"
                                icon={<span>👥</span>}
                                className="bg-white"
                            >
                                <p className="text-xs text-gray-500">ont trouvé le personnel sympathique</p>
                            </StatCard>
                            <StatCard
                                title="Qualité"
                                value="106"
                                unit="personnes"
                                icon={<span>⭐</span>}
                                className="bg-white"
                            >
                                <p className="text-xs text-gray-500">ont trouvé les produits qualitatifs</p>
                            </StatCard>
                            <StatCard
                                title="Quantité"
                                value="84"
                                unit="personnes"
                                icon={<span>🍽️</span>}
                                className="bg-white"
                            >
                                <p className="text-xs text-gray-500">ont trouvé que les produits étaient copieux</p>
                            </StatCard>
                        </div> */}


                        {product.seller && product.seller.id != user?.id && (
                            <div className="mt-8">
                                <ContactSellerButton
                                    offerId={product.id}
                                    sellerId={product.seller.id}
                                    className="w-full text-white py-3 rounded-lg font-medium"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}