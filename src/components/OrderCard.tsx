import { Product } from "@/api/Product";

interface OrderCardProps {
  product: Product;
}

const OrderCard = ({ product }: OrderCardProps) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? `${import.meta.env.VITE_BACKEND_URL}/images/files/${product.images[0].name}`
      : "";

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg drop-shadow-lg max-w-full cursor-pointer hover:bg-purple-50 transition-all">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1 max-w-[calc(100%-5rem)]">
        <h3 className="font-semibold">{product.name}</h3>
        {product.description && (
          <div className="flex items-center gap-2">
            <div className=" flex w-full items-center text-gray-600 gap-0.5">
              <span className="truncate w-full">{product.description}</span>
            </div>
          </div>
        )}
        <div className="text-sm text-purple-dark mt-1">
          {product.price}€ ·{" "}
          {new Date(product.expiryDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
