import { useFormContext } from 'react-hook-form';
import { useAtom } from 'jotai';
import { sellFormDataAtom } from './atoms';
import { ProductFormData } from '@/api/Product';
import { useUserData } from '@/api/User';
import { Info } from 'lucide-react';
import { CustomTooltip } from '../ui/customTooltip';

const ProductInfoStep = () => {
    useUserData();
    const { register, watch } = useFormContext<ProductFormData>();
    const [formData] = useAtom(sellFormDataAtom);
    const price = watch('price');

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
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                    placeholder="Ex: 1.99"
                />
                {price !== null && price > 0.0 && (
                    <div className='flex gap-1 items-center mt-2'>
                        <p className="text-xs text-gray-500">
                            Vous serez payé {(price * (1 - Number(import.meta.env.VITE_SERVICE_FEES))).toFixed(2)}€ de ce montant après la commission.
                        </p>
                        <CustomTooltip 
                        trigger={<Info className="inline-block ml-1 w-4 h-4 text-purple-dark cursor-pointer" />}
                        content="Le montant final que vous recevrez après déduction des frais de service de MealMates."
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductInfoStep;
