import { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { useAtom } from 'jotai';
import { atom } from 'jotai';
import ProfileAppBar from '@/components/ProfileAppBar';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Address, useUserData } from '@/api/User';
import { useAddProductMutation, ProductFormData } from '@/api/Product';
import { useAllergens } from '@/api/Allergen';
import { useFoodPreferences } from '@/api/FoodPreference';
import { toast } from 'sonner';
import { MultiSelect } from '@/components/ui/multi-select';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Set up our form atoms for state management across steps
export const sellFormDataAtom = atom<{
    name: string;
    description: string;
    quantity: number;
    price: number;
    expiryDate: string;
    isRecurring: boolean;
    allergens: number[];
    food_preferences: number[];
    images: {
        name: string;
        mimeType: string;
        data: string;
    }[];
    address?: number;
}>({
    name: '',
    description: '',
    quantity: 1,
    price: 0,
    expiryDate: '',
    isRecurring: false,
    allergens: [],
    food_preferences: [],
    images: [],
    address: undefined
});

// Create type for form steps
type FormStep = 'productInfo' | 'detailsInfo' | 'imageUpload' | 'locationInfo' | 'confirmation';

export default function SellPage() {
    const [formStep, setFormStep] = useState<FormStep>('productInfo');
    const [formData, setFormData] = useAtom(sellFormDataAtom);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmedProduct, setConfirmedProduct] = useState<any>(null);

    // Initialize form with atom data
    const methods = useForm<ProductFormData>({
        defaultValues: formData,
        mode: 'onChange'
    });

    // This function has been integrated into the form submission handler

    const goToPreviousStep = () => {
        if (formStep === 'detailsInfo') {
            setFormStep('productInfo');
        } else if (formStep === 'imageUpload') {
            setFormStep('detailsInfo');
        } else if (formStep === 'locationInfo') {
            setFormStep('imageUpload');
        }
    };

    // Use the mutation hook for adding products
    const addProductMutation = useAddProductMutation();

    const onSubmit = async (data: ProductFormData) => {
        try {
            setIsSubmitting(true);

            // Parse and convert checkbox values for allergens and food_preferences
            // React Hook Form may have stored these as strings
            const allergens = Array.isArray(data.allergens)
                ? data.allergens.map(val => typeof val === 'string' ? parseInt(val) : val)
                : formData.allergens || [];

            const food_preferences = Array.isArray(data.food_preferences)
                ? data.food_preferences.map(val => typeof val === 'string' ? parseInt(val) : val)
                : formData.food_preferences || [];

            // Combine the form data from the current step with the data from previous steps
            const finalFormData = {
                ...formData,
                ...data,
                // Ensure these are properly set with correct types
                allergens,
                food_preferences,
                images: data.images || formData.images || [],
                address: data.address || formData.address
            };

            finalFormData.allergens = finalFormData.allergens.map(Number);
            finalFormData.food_preferences = finalFormData.food_preferences.map(Number);
            finalFormData.expiryDate = new Date(finalFormData.expiryDate).toISOString();
            finalFormData.quantity = parseInt(finalFormData.quantity.toString());
            finalFormData.price = parseFloat(finalFormData.price.toString());

            // Send the data to the backend using the mutation
            const response = await addProductMutation.mutateAsync(finalFormData);

            toast.success('Votre produit a été mis en vente avec succès!');

            // Store the product info for confirmation page
            const confirmedProduct = {
                ...finalFormData,
                id: response?.id || Date.now() // Use real ID if available or temporary ID
            };

            // Set submitted data for confirmation page
            setConfirmedProduct(confirmedProduct);

            // Navigate to confirmation page
            setFormStep('confirmation');
        } catch (error: any) {
            console.error('Error submitting product:', error);
            toast.error('Une erreur est survenue lors de la mise en vente de votre produit.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen relative bg-gray-100 overflow-x-hidden pb-20">
            <ProfileAppBar>
                <div className='relative flex items-center w-full h-full justify-center'>
                    <Button
                        type="button"
                        variant="ghost"
                        className='absolute left-3 p-1'
                        onClick={() => window.history.back()}
                    >
                        <ArrowBackIosOutlined fontSize="small" />
                    </Button>
                    <h1 className='font-bold text-xl'>Vendre un produit</h1>
                </div>
            </ProfileAppBar>

            <div className="max-w-md mx-auto mt-4 px-4">
                {/* Stepper */}
                {formStep !== 'confirmation' ? (
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div
                                onClick={() => setFormStep('productInfo')}
                                className={`w-1/4 text-center cursor-pointer hover:text-purple-dark/80 transition-colors ${formStep === 'productInfo' ? 'text-purple-dark font-bold' : 'text-gray-400'
                                    }`}
                            >
                                Produit
                            </div>
                            <div
                                onClick={() => formStep !== 'productInfo' && setFormStep('detailsInfo')}
                                className={`w-1/4 text-center ${formStep === 'detailsInfo' ? 'text-purple-dark font-bold' : 'text-gray-400'
                                    } ${formStep !== 'productInfo' ? 'cursor-pointer hover:text-purple-dark/80 transition-colors' : 'opacity-50'}`}
                            >
                                Détails
                            </div>
                            <div
                                onClick={() => (formStep === 'imageUpload' || formStep === 'locationInfo') && setFormStep('imageUpload')}
                                className={`w-1/4 text-center ${formStep === 'imageUpload' ? 'text-purple-dark font-bold' : 'text-gray-400'
                                    } ${(formStep === 'imageUpload' || formStep === 'locationInfo') ? 'cursor-pointer hover:text-purple-dark/80 transition-colors' : 'opacity-50'}`}
                            >
                                Images
                            </div>
                            <div
                                className={`w-1/4 text-center ${formStep === 'locationInfo' ? 'text-purple-dark font-bold' : 'text-gray-400'
                                    } opacity-50`}
                            >
                                Lieu
                            </div>
                        </div>
                        <div className="mt-2 flex">
                            <div className={`h-2 flex-1 rounded-l-full ${formStep === 'productInfo' ? 'bg-purple-dark' : 'bg-purple-dark/30'}`}></div>
                            <div className={`h-2 flex-1 ${formStep === 'detailsInfo' ? 'bg-purple-dark' : formStep === 'productInfo' ? 'bg-gray-300' : 'bg-purple-dark/30'}`}></div>
                            <div className={`h-2 flex-1 ${formStep === 'imageUpload' ? 'bg-purple-dark' : formStep === 'productInfo' || formStep === 'detailsInfo' ? 'bg-gray-300' : 'bg-purple-dark/30'}`}></div>
                            <div className={`h-2 flex-1 rounded-r-full ${formStep === 'locationInfo' ? 'bg-purple-dark' : 'bg-gray-300'}`}></div>
                        </div>
                    </div>
                ) : null}

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit((data) => {
                        if (formStep === 'locationInfo') {
                            onSubmit(data);
                        } else {
                            // Save the current step data to our atom
                            setFormData(prev => ({ ...prev, ...data }));

                            // Determine the next step
                            if (formStep === 'productInfo') {
                                setFormStep('detailsInfo');
                            } else if (formStep === 'detailsInfo') {
                                setFormStep('imageUpload');
                            } else if (formStep === 'imageUpload') {
                                setFormStep('locationInfo');
                            }
                        }
                    })}>
                        {/* Step 1: Product Basic Info */}
                        {formStep === 'productInfo' && <ProductInfoStep />}

                        {/* Step 2: Details Info */}
                        {formStep === 'detailsInfo' && <DetailsInfoStep />}

                        {/* Step 3: Image Upload */}
                        {formStep === 'imageUpload' && <ImageUploadStep />}

                        {/* Step 4: Location Info */}
                        {formStep === 'locationInfo' && <LocationInfoStep />}

                        {/* Step 5: Confirmation */}
                        {formStep === 'confirmation' && <ConfirmationStep product={confirmedProduct} />}

                        {/* Navigation buttons */}
                        {formStep !== 'confirmation' && (
                            <div className="mt-8 flex justify-between">
                                {formStep !== 'productInfo' && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={goToPreviousStep}
                                        className="text-purple-dark"
                                    >
                                        Précédent
                                    </Button>
                                )}

                                <div className="ml-auto">
                                    {formStep === 'locationInfo' ? (
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-purple-dark hover:bg-purple-dark/90"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                                                    Mise en vente...
                                                </>
                                            ) : (
                                                'Mettre en vente'
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-purple-dark hover:bg-purple-dark/90"
                                        >
                                            Continuer
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}

// Step 1: Product Basic Information
const ProductInfoStep = () => {
    useUserData();
    // Use useFormContext to get access to the parent form's methods
    const { register } = useFormContext<ProductFormData>();
    const [formData] = useAtom(sellFormDataAtom);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informations sur le produit</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit
                </label>
                <input
                    {...register('name')}
                    type="text"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    placeholder="Ex: Des Bananes"
                    defaultValue={formData.name}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    placeholder="Décrivez votre produit en détail"
                    defaultValue={formData.description}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (€)
                </label>
                <input
                    {...register('price')}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    placeholder="Ex: 1.99"
                    defaultValue={formData.price}
                />
            </div>
        </div>
    );
};

// Step 2: Product Details
const DetailsInfoStep = () => {
    const { register, setValue } = useFormContext<ProductFormData>();
    const [formData, setFormData] = useAtom(sellFormDataAtom);

    // Get allergens and food preferences from API
    const { data: allergens } = useAllergens();
    const { data: foodPreferences } = useFoodPreferences();

    // Use API data when available, fallback to default options
    const foodPreferenceOptions = foodPreferences?.map(pref => ({
        id: pref.id,
        label: pref.name,
        value: pref.id
    })) || []

    const allergenOptions = allergens?.map(allergen => ({
        id: allergen.id,
        label: allergen.name,
        value: allergen.id
    })) || []

    const selectedAllergens = allergenOptions.filter(option =>
        formData.allergens.includes(option.id)
    )

    const selectedFoodPreferences = foodPreferenceOptions.filter(option =>
        formData.food_preferences.includes(option.id)
    )

    // watch number input

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Détails du produit</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité
                </label>
                <input
                    {...register('quantity')}
                    type="number"
                    min="1"
                    pattern='[+]?(?:0|[1-9]\d*)(?:\.\d+)?'
                    inputMode='decimal'
                    autoComplete='off'
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    placeholder="Ex: 4"
                    defaultValue={formData.quantity}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'expiration
                </label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.expiryDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.expiryDate ? format(new Date(formData.expiryDate), "PPP") : <span>Choisir une date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={formData.expiryDate ? new Date(formData.expiryDate) : undefined}
                            onSelect={(date) => {
                                const isoDate = date ? date.toISOString() : '';
                                setFormData(prev => ({ ...prev, expiryDate: isoDate }));
                                setValue('expiryDate', isoDate);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex items-center mb-4">
                <input
                    {...register('isRecurring')}
                    id="isRecurring"
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 rounded text-purple-dark focus:ring-purple-dark"
                    defaultChecked={formData.isRecurring}
                />
                <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
                    Offre récurrente
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Préférences alimentaires
                </label>
                <MultiSelect
                    options={foodPreferenceOptions}
                    selected={selectedFoodPreferences}
                    onChange={(selected) => {
                        const selectedIds = selected.map(item => item.id);
                        setFormData({ ...formData, food_preferences: selectedIds });
                        setValue('food_preferences', selectedIds);
                    }}
                    placeholder="Sélectionner des préférences alimentaires..."
                    className="border-gray-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergènes
                </label>
                <MultiSelect
                    options={allergenOptions}
                    selected={selectedAllergens}
                    onChange={(selected) => {
                        const selectedIds = selected.map(item => item.id);
                        setFormData({ ...formData, allergens: selectedIds });
                        setValue('allergens', selectedIds);
                    }}
                    placeholder="Sélectionner des allergènes..."
                    className="border-gray-300"
                />
            </div>
        </div>
    );
};

// Step 3: Image Upload
const ImageUploadStep = () => {
    // Initialize images from atom data
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
            // Update both the Jotai atom and the React Hook Form state
            setFormData({ ...formData, images: updatedImages });
            setValue('images', updatedImages);
        });
    };

    const removeImage = (index: number) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
        // Update both the Jotai atom and the React Hook Form state
        setFormData({ ...formData, images: updatedImages });
        setValue('images', updatedImages);
    };

    // Initialize with images from form data when component mounts
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
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Photos téléchargées ({images.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
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
                </div>
            )}
        </div>
    );
};

// Step 4: Location Information
const LocationInfoStep = () => {
    const [formData, setFormData] = useAtom(sellFormDataAtom);
    const { data: userData, isLoading } = useUserData();
    const { setValue } = useFormContext<ProductFormData>();

    const handleAddressSelect = (addressId: number) => {
        // Update both the Jotai atom and the React Hook Form state
        setFormData({ ...formData, address: addressId });
        setValue('address', addressId);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Lieu de retrait</h2>

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-dark"></div>
                </div>
            ) : userData && userData.address && userData.address.length > 0 ? (
                <div className="space-y-3">
                    {userData.address.map((address: Address) => (
                        <div
                            key={address.id}
                            className={`p-4 border rounded-lg cursor-pointer ${formData.address === address.id ? 'border-purple-dark bg-purple-50' : 'border-gray-300'
                                }`}
                            onClick={() => handleAddressSelect(address.id)}
                        >
                            <p className="font-medium">{address.address}</p>
                            <p className="text-sm text-gray-600">{address.zipCode} {address.city}, {address.region}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore d'adresse. Veuillez en ajouter une dans les paramètres de votre compte.</p>
                    <Button
                        type="button"
                        onClick={() => window.location.href = '/app/profile/settings'}
                        className="mt-2 bg-purple-dark hover:bg-purple-dark/90"
                    >
                        Ajouter une adresse
                    </Button>
                </div>
            )}
        </div>
    );
};

// Step 5: Confirmation
const ConfirmationStep = ({ product }: { product: any }) => {
    // Get allergens and food preferences from API to show proper names
    const { data: allergens } = useAllergens();
    const { data: foodPreferences } = useFoodPreferences();

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            // Silently catch any errors and return original string
            return dateStr;
        }
    };

    // Functions to get name from ID
    const getAllergenName = (id: number) => {
        return allergens?.find(a => a.id === id)?.name || `ID: ${id}`;
    };

    const getFoodPreferenceName = (id: number) => {
        return foodPreferences?.find(p => p.id === id)?.name || `ID: ${id}`;
    };

    // Reset form and redirect to sell another product
    const handleSellAnother = () => {
        // We'll reload the page to reset all form state
        window.location.href = '/app/sell';
    };

    // Go to profile page
    const handleViewProfile = () => {
        window.location.href = '/app/profile';
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
                                    className="w-full h-full object-cover"
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
                                    <span className="text-gray-600">Date d'expiration :</span>
                                    <span className="font-medium">{formatDate(product.expiryDate)}</span>
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
