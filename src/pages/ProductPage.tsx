import { useParams } from 'react-router';
import { useProduct } from '@/api/Product';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

export default function ProductPage() {
    const { id } = useParams();
    const { data: product, isLoading, error } = useProduct(Number(id));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark"></div>
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                {/* Product Images */}
                <div className="aspect-square rounded-lg overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/files/${product.images[0].name}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image available</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

                    <div className="mt-3">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl tracking-tight text-gray-900">{product.price}€</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Description</h3>
                        <p className="text-base text-gray-700">{product.description}</p>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center">
                            <p className={`text-sm ${isExpiringSoon ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                                Expire le: {dayjs(product.expiryDate).format('DD MMMM YYYY')}
                                {isExpiringSoon && ' (Bientôt expiré)'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center">
                            <p className="text-sm text-gray-700">
                                Quantité: {product.quantity}
                            </p>
                        </div>
                    </div>

                    {product.seller && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-900">Vendeur</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {product.seller.first_name} {product.seller.last_name?.[0]}.
                            </p>
                        </div>
                    )}

                    {/* Food Preferences */}
                    {product.food_preferences && product.food_preferences.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-900">Préférences alimentaires</h3>
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

                    {/* Allergens */}
                    {product.allergens && product.allergens.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-900">Allergènes</h3>
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

                    {/* Contact Button */}
                    <div className="mt-10 flex">
                        <button
                            type="button"
                            className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-purple-600 px-8 py-3 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                        >
                            Contacter le vendeur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}