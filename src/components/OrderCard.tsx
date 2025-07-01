import { Product } from "@/api/Product";
import logo from '@/assets/MealMatesLogo.webp';

interface OrderCardProps {
  product: Product;
  onClick?: () => void;
}

const OrderCard = ({ product, onClick }: OrderCardProps) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? `${import.meta.env.VITE_BACKEND_URL}/images/files/${product.images[0].name}`
      : "";

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 bg-white p-4 rounded-lg drop-shadow-lg max-w-full cursor-pointer hover:bg-purple-50 transition-all"
    >
      {product.images?.[0] ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="size-16 object-cover rounded-lg pointer-events-none"
        />
      ) : (
        <div className="size-16 bg-purple-100 rounded-lg flex items-center justify-center">
          <img src={logo} alt="" className='w-1/3' />
        </div>
      )}
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
