import { Product } from '@/api/Product';
import { Separator } from "@/components/ui/separator"
import { MapPin } from 'lucide-react';
import { useAtom } from 'jotai';
import { locationAtom } from '@/atoms/location';
import { calculateDistanceInKm } from '@/utils/geoUtils';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
dayjs.locale('fr');

interface DiscoverCardProps {
    product: Product;
    onClick: (productId: number) => void;
}

const backEndUrl = import.meta.env.VITE_BACKEND_URL;
const DiscoverCard = ({ product, onClick }: DiscoverCardProps) => {
    const [location] = useAtom(locationAtom);

    const distance = product.position && location
        ? calculateDistanceInKm(
            location.latitude,
            location.longitude,
            product.position[0],
            product.position[1]
        ).toFixed(1)
        : null;

    return (
        <div
            className="bg-white w-full h-full rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:bg-purple-50 transition-all "
            onClick={() => onClick(product.id)}
        >
            {product.images && product.images.length > 0 && (
                <div className="relative h-48">
                    <img
                        src={backEndUrl + '/images/files/' + product.images[0].name}
                        alt={product.name}
                        className="w-full h-full object-cover p-1 rounded-lg"
                    />
                    {distance && (
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gray-700 font-medium flex items-center gap-1">
                            <MapPin size={12} />
                            {distance} km
                        </div>
                    )}
                </div>
            )}

            <div className='flex flex-col h-[calc(100%-12rem)]'>
                <div className="p-2 flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            {product.seller && (
                                <div className="text-sm text-gray-500">
                                    {product.seller.first_name} {product.seller.last_name}
                                </div>
                            )}
                        </div>
                        {product.sellerRating && (
                            <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-700">{product.sellerRating.toFixed(1)}</span>
                                <span className="ml-1">⭐</span>
                            </div>
                        )}
                    </div>

                    {product.expiryDate && (
                        <div className="mt-2 text-sm">
                            {(() => {
                                const today = dayjs().startOf('day');
                                const expiryDate = dayjs(product.expiryDate).startOf('day');
                                const daysUntilExpiry = expiryDate.diff(today, 'day');

                                if (expiryDate.isBefore(today)) {
                                    return <span className="text-red-500 font-semibold">Déjà expiré</span>;
                                } else if (daysUntilExpiry === 0) {
                                    return <span className="text-red-500 font-semibold">Expire aujourd'hui</span>;
                                } else if (daysUntilExpiry === 1) {
                                    return <span className="text-orange-500 font-semibold">Expire demain</span>;
                                } else if (daysUntilExpiry <= 3) {
                                    return <span className="text-orange-500 font-semibold">Expire dans {daysUntilExpiry} jours</span>;
                                } else {
                                    return <span className="text-green-500 font-semibold">Expire dans {daysUntilExpiry} jours</span>;
                                }
                            })()}
                        </div>
                    )}
                </div>

                <div>
                    <Separator className="h-0 border-t border-dashed bg-transparent" />
                    <div className="p-2 w-full text-right">
                        {product.dynamicPrice ? (
                            <div className="flex items-center justify-end">
                                <span className="text-sm font-light line-through text-gray-500 mr-2">
                                    {product.price.toFixed(2)}€
                                </span>
                                <span className="text-lg font-semibold text-purple-dark">
                                    {product.dynamicPrice.toFixed(2)}€
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-semibold text-purple-dark">
                                {product.price.toFixed(2)}€
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoverCard;