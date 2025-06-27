type FormStep = 'productInfo' | 'detailsInfo' | 'imageUpload' | 'locationInfo' | 'confirmation';

interface SellPageStepperProps {
    formStep: FormStep;
    setFormStep: (step: FormStep) => void;
}

const SellPageStepper = ({ formStep, setFormStep }: SellPageStepperProps) => {
    return (
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
    );
};

export default SellPageStepper;
