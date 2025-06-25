import { NavigateFunction } from 'react-router';
import { useAllergens } from '@/api/Allergen';
import { useFoodPreferences } from '@/api/FoodPreference';
import { Button } from '@/components/ui/button';
import { formatStringToDate } from '@/utils/date';

interface ConfirmationStepProps {
    product: any;
    navigate: NavigateFunction;
}

const ConfirmationStep = ({ product, navigate }: ConfirmationStepProps) => {
    const { data: allergens } = useAllergens();
    const { data: foodPreferences } = useFoodPreferences();

    const getAllergenName = (id: number) => {
        return allergens?.find(a => a.id === id)?.name || `ID: ${id}`;
    };

    const getFoodPreferenceName = (id: number) => {
        return foodPreferences?.find(p => p.id === id)?.name || `ID: ${id}`;
    };

    const handleSellAnother = () => {
        navigate(0);
    };

    const handleViewProfile = () => {
        navigate('/app/profile');
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Félicitations !</h2>
                <p className="mt-2 text-gray-600">Votre produit a été mis en vente avec succès</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start">
                    {product.images && product.images.length > 0 && (
                        <div className="mr-4">
                            <div className="w-32 h-32 overflow-hidden rounded-lg">
                                <img
                                    src={`data:${product.images[0].mimeType};base64,${product.images[0].data}`}
                                    alt={product.name}
                                    className="size-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex-grow">
                        <h3 className="font-semibold text-lg mb-4">Détails du produit</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Nom :</span>
                                <span className="font-medium">{product.name}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Prix :</span>
                                <span className="font-bold text-green-600">{product.price == 0 ? "Don" : product.price + " €"} </span>
                            </div>

                            {product.quantity && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Quantité :</span>
                                    <span className="font-medium">{product.quantity}</span>
                                </div>
                            )}

                            {product.expiryDate && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 mr-2">Date d'expiration : </span>
                                    <span className="font-medium">{formatStringToDate(product.expiryDate)}</span>
                                </div>
                            )}

                            {product.isRecurring && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type d'offre :</span>
                                    <span className="font-medium">Récurrente</span>
                                </div>
                            )}
                        </div>

                        {product.description && (
                            <div className="mt-3 pt-3 border-t">
                                <span className="text-gray-600 block mb-1">Description :</span>
                                <p className="text-sm text-gray-700">{product.description}</p>
                            </div>
                        )}

                        {/* Show dietary preferences and allergens if available */}
                        <div className="mt-3 pt-3 border-t">
                            {product.food_preferences && product.food_preferences.length > 0 && (
                                <div className="mb-3">
                                    <span className="text-gray-600 text-sm">Préférences alimentaires :</span>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {product.food_preferences.map((id: number) => (
                                            <span key={id} className="inline-block px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs">
                                                {getFoodPreferenceName(id)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.allergens && product.allergens.length > 0 && (
                                <div>
                                    <span className="text-gray-600 text-sm">Allergènes :</span>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {product.allergens.map((id: number) => (
                                            <span key={id} className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                                                {getAllergenName(id)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-800">
                    <span className="font-medium">Astuce :</span> Les acheteurs potentiels peuvent maintenant voir votre offre.
                    Vous recevrez une notification lorsque quelqu'un sera intéressé par votre produit.
                </p>
            </div>

            <div className="flex justify-center space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    className="border-purple-dark text-purple-dark"
                    onClick={handleViewProfile}
                >
                    Voir mon profil
                </Button>
                <Button
                    type="button"
                    className="bg-purple-dark hover:bg-purple-dark/90"
                    onClick={handleSellAnother}
                >
                    Vendre un autre produit
                </Button>
            </div>
        </div>
    );
};

export default ConfirmationStep;
