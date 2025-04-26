import { Product } from '@/api/Product';

interface DiscoverCardProps {
    product: Product;
    // onClick: (productId: number) => void;
}

const backEndUrl = import.meta.env.VITE_BACKEND_URL;
const DiscoverCard = ({ product }: DiscoverCardProps) => {
    return (
        <div
            className="bg-white w-full rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
        // onClick={() => onClick(product.id)}
        >
            {product.images && product.images.length > 0 && (
                <div className="relative h-48">
                    <img
                        src={backEndUrl + '/images/files/' + product.images[0].name}
                        alt={product.name}
                        className="w-full h-full object-cover p-1 rounded-lg"
                    />
                </div>
            )}

            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    <span className="font-bold text-purple-dark">{product.price}€</span>
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
                    <div className="mt-2 text-sm text-gray-500">
                        Expires: {new Date(product.expiryDate).toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoverCard;