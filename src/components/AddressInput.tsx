import { ChangeEvent, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { cn } from '@/lib/utils';
import { Address } from '@/api/User';

interface AddressInputProps {
    placeholder?: string;
    onSelect: (value: Address) => void;
    className?: string;
}

interface Suggestion {
    properties: {
        id: number;
        city: string;
        postcode: string;
        name: string;
        label: string;
        context: string;
    };
    geometry: {
        coordinates: [number, number];
    };
}

const AddressInput: React.FC<AddressInputProps> = ({
    placeholder = 'Rechercher ...',
    onSelect,
    className = '',
}) => {
    const [addressInput, setAddressInput] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const fetchAddressSuggestions = async (query: string) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
                    query
                )}&limit=5`
            );
            const data = await response.json();
            setSuggestions(data.features);
        } catch (error) {
            console.error("Erreur lors de la récupération des suggestions:", error);
            setSuggestions([]);
        }
    };

    const debouncedFetchSuggestions = useRef(
        debounce((query: string) => {
            fetchAddressSuggestions(query);
        }, 300)
    ).current;

    const handleAddressInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAddressInput(value);

        if (value.length >= 4) {
            debouncedFetchSuggestions(value);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        const selectedAddress: Address = {
            id: suggestion.properties.id,
            city: suggestion.properties.city,
            zipCode: suggestion.properties.postcode,
            address: suggestion.properties.name,
            region: suggestion.properties.context,
            longitude: suggestion.geometry.coordinates[0],
            latitude: suggestion.geometry.coordinates[1],
        };
        setAddressInput(selectedAddress.address);
        onSelect(selectedAddress);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSelect(
                suggestions[0] ? {
                    id: suggestions[0].properties.id,
                    city: suggestions[0].properties.city,
                    zipCode: suggestions[0].properties.postcode,
                    address: suggestions[0].properties.name,
                    region: suggestions[0].properties.context,
                    longitude: suggestions[0].geometry.coordinates[0],
                    latitude: suggestions[0].geometry.coordinates[1],
                } : {
                    id: 0,
                    city: '',
                    zipCode: '',
                    address: '',
                    region: '',
                    longitude: 0,
                    latitude: 0,
                }
            );
            setShowSuggestions(false);
        }
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={addressInput}
                onChange={handleAddressInput}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="min-h-10 w-full py-2 px-4 text-sm text-gray-700 border border-gray-400 bg-white rounded-xl outline-none placeholder:text-purple-dark"
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className={cn("z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto", className)}>
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.properties.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <div className="flex items-center">
                                <LocationOnOutlinedIcon
                                    sx={{ width: '16px', height: '16px' }}
                                    className="text-purple-dark mr-2 mt-1 flex-shrink-0"
                                />
                                <span>{suggestion.properties.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressInput;
