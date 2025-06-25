import { useFormContext } from 'react-hook-form';
import { useAtom } from 'jotai';
import { sellFormDataAtom } from './atoms';
import { ProductFormData } from '@/api/Product';
import { useAllergens } from '@/api/Allergen';
import { useFoodPreferences } from '@/api/FoodPreference';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { dateToString } from '@/utils/date';

const DetailsInfoStep = () => {
    const { register, setValue } = useFormContext<ProductFormData>();
    const [formData, setFormData] = useAtom(sellFormDataAtom);

    const { data: allergens } = useAllergens();
    const { data: foodPreferences } = useFoodPreferences();

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
                    pattern='[+]?(?:0|[1-9]\\d*)(?:\\.\\d+)?'
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
                                const formattedDate = date ? dateToString(date) : '';
                                setFormData(prev => ({ ...prev, expiryDate: formattedDate }));
                                setValue('expiryDate', formattedDate);
                            }}
                            disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                            }}
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

export default DetailsInfoStep;
