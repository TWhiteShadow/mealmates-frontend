import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAtom } from 'jotai';
import { sellFormDataAtom } from './atoms';
import { ProductFormData } from '@/api/Product';
import { Address, useUserData } from '@/api/User';
import { NavigateFunction } from 'react-router';
import { Button } from '@/components/ui/button';

interface LocationInfoStepProps {
    navigate: NavigateFunction;
}

const LocationInfoStep = ({ navigate }: LocationInfoStepProps) => {
    const [formData, setFormData] = useAtom(sellFormDataAtom);
    const { data: userData, isLoading } = useUserData();
    const { setValue } = useFormContext<ProductFormData>();

    useEffect(() => {
        if (userData && userData.address && userData.address.length > 0 && !formData.address) {
            const firstAddressId = userData.address[0].id;
            setFormData({ ...formData, address: firstAddressId! });
            setValue('address', firstAddressId!);
        }
    }, [userData, formData, setFormData, setValue]);

    const handleAddressSelect = (addressId: number) => {
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
                            onClick={() => handleAddressSelect(address.id!)}
                        >
                            <p className="font-medium">{address.address}</p>
                            <p className="text-sm text-gray-600">{address.region}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore d'adresse. Veuillez en ajouter une dans les paramètres de votre compte.</p>
                    <Button
                        type="button"
                        onClick={() => navigate(`/app/profile/settings?redirectURI=/app/sell`)}
                        className="mt-2 bg-purple-dark hover:bg-purple-dark/90"
                    >
                        Ajouter une adresse
                    </Button>
                </div>
            )}
        </div>
    );
};

export default LocationInfoStep;
