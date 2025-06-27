import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router';
import { sellFormDataAtom } from './atoms';
import { ProductFormData, useAddProductMutation } from '@/api/Product';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import ProductInfoStep from './ProductInfoStep';
import DetailsInfoStep from './DetailsInfoStep';
import ImageUploadStep from './ImageUploadStep';
import LocationInfoStep from './LocationInfoStep';
import ConfirmationStep from './ConfirmationStep';
import SellPageStepper from './SellPageStepper';

type FormStep = 'productInfo' | 'detailsInfo' | 'imageUpload' | 'locationInfo' | 'confirmation';

const SellPageForm = () => {
    const [formStep, setFormStep] = useState<FormStep>('productInfo');
    const [formData, setFormData] = useAtom(sellFormDataAtom);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmedProduct, setConfirmedProduct] = useState<any>(null);
    const navigate = useNavigate();

    const methods = useForm<ProductFormData>({
        defaultValues: formData,
        mode: 'onChange'
    });

    const addProductMutation = useAddProductMutation();

    const goToPreviousStep = () => {
        if (formStep === 'detailsInfo') {
            setFormStep('productInfo');
        } else if (formStep === 'imageUpload') {
            setFormStep('detailsInfo');
        } else if (formStep === 'locationInfo') {
            setFormStep('imageUpload');
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        try {
            setIsSubmitting(true);

            const allergens = Array.isArray(data.allergens)
                ? data.allergens.map(val => typeof val === 'string' ? parseInt(val) : val)
                : formData.allergens || [];

            const food_preferences = Array.isArray(data.food_preferences)
                ? data.food_preferences.map(val => typeof val === 'string' ? parseInt(val) : val)
                : formData.food_preferences || [];

            const finalFormData = {
                ...formData,
                ...data,
                allergens,
                food_preferences,
                images: data.images || formData.images || [],
                address: data.address || formData.address
            };

            finalFormData.allergens = finalFormData.allergens.map(Number);
            finalFormData.food_preferences = finalFormData.food_preferences.map(Number);
            finalFormData.quantity = parseInt(finalFormData.quantity.toString());
            finalFormData.price = parseFloat(finalFormData.price.toString());

            const response = await addProductMutation.mutateAsync(finalFormData);

            const confirmedProduct = {
                ...finalFormData,
                id: response?.id || Date.now()
            };

            setConfirmedProduct(confirmedProduct);
            setFormStep('confirmation');
        } catch (error: any) {
            console.error('Error submitting product:', error);
            toast.error('Une erreur est survenue lors de la mise en vente de votre produit.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-4 px-4">
            {formStep !== 'confirmation' && <SellPageStepper formStep={formStep} setFormStep={setFormStep} />}

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => {
                    if (formStep === 'locationInfo') {
                        onSubmit(data);
                    } else {
                        setFormData((prev) => ({ ...prev, ...data }));

                        if (formStep === 'productInfo') {
                            setFormStep('detailsInfo');
                        } else if (formStep === 'detailsInfo') {
                            setFormStep('imageUpload');
                        } else if (formStep === 'imageUpload') {
                            setFormStep('locationInfo');
                        }
                    }
                })}>
                    {formStep === 'productInfo' && <ProductInfoStep />}
                    {formStep === 'detailsInfo' && <DetailsInfoStep />}
                    {formStep === 'imageUpload' && <ImageUploadStep />}
                    {formStep === 'locationInfo' && <LocationInfoStep navigate={navigate} />}
                    {formStep === 'confirmation' && <ConfirmationStep navigate={navigate} product={confirmedProduct} />}

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
    );
};

export default SellPageForm;
