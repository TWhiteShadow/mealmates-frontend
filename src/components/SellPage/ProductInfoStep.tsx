import { useFormContext } from 'react-hook-form';
import { useAtom } from 'jotai';
import { sellFormDataAtom } from './atoms';
import { ProductFormData } from '@/api/Product';
import { useUserData } from '@/api/User';

const ProductInfoStep = () => {
    useUserData();
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

export default ProductInfoStep;
