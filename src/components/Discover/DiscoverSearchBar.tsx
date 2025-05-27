import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';
import { locationAtom, updateLocationAtom, isLoadingLocationAtom } from '@/atoms/location';
import AddressInput from '@/components/AddressInput';
import { Address } from '@/api/User';
import { Button } from '../ui/button';

interface DiscoverSearchBarProps {
    onLocationChange?: (location: Address) => void;
}

const DiscoverSearchBar: React.FC<DiscoverSearchBarProps> = ({
    onLocationChange,
}) => {
    const [location, setLocation] = useAtom(locationAtom);
    const updateLocation = useSetAtom(updateLocationAtom);
    const isLoadingLocation = useAtomValue(isLoadingLocationAtom);
    const [currentAddress, setCurrentAddress] = useState<string>('');

    // Get the address from coordinates when component mounts or location changes
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await fetch(
                    `https://api-adresse.data.gouv.fr/reverse/?lon=${location.longitude}&lat=${location.latitude}`
                );
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    setCurrentAddress(data.features[0].properties.label);
                }
            } catch (error) {
                console.error('Error fetching address:', error);
            }
        };

        fetchAddress();
    }, [location]);

    const handleLocationSelection = (address: Address) => {
        setLocation({
            latitude: address.latitude,
            longitude: address.longitude,
            lastUpdated: Date.now(),
        });
        if (onLocationChange) {
            onLocationChange(address);
        }
    };

    return (
        <div className="relative pt-8">
            <div className="w-full flex items-center max-w-md mx-auto rounded-xl gap-2">
                <Button
                    className="bg-purple-light h-[40px] w-[40px] rounded-full"
                    variant="secondary"
                    onClick={() => updateLocation()}
                    disabled={isLoadingLocation}
                >
                    <Navigation className="text-purple-dark !opacity-100" />
                </Button>
                <AddressInput
                    placeholder={currentAddress || "Où te trouves-tu ?"}
                    onSelect={handleLocationSelection}
                />
            </div>
        </div>
    );
};

export default DiscoverSearchBar;