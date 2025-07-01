import { Product } from '@/api/Product';
import { Button } from '@/components/ui/button';
import { Clock, Star, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import logo from '@/assets/MealMatesLogo.webp';
import UserCardLink from '@/components/UserCardLink';
import dayjs from 'dayjs';

interface OfferCardProps {
  offer: Product | null;
  onClose: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onClose }) => {
  if (!offer) return null;

  const navigate = useNavigate();
  const goToProduct = () => {
    if (offer.id) {
      navigate(`/app/product/${offer.id}`);
      onClose();
    }
  };

  const isExpiringSoon = dayjs(offer.expiryDate).diff(dayjs(), 'day') <= 1;
  return (
    <div className='fixed max-w-[800px] w-full mx-auto bottom-[56px] left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 transition-transform duration-300 ease-in-out transform translate-y-0'>
      <div className='p-4'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
        >
          <XCircle size={24} />
        </button>

        <div className='flex gap-6'>
          <div className='relative'>
            {isExpiringSoon && (
              <div className='absolute top-2 left-2 z-10'>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800'>
                  <Clock className='mr-1' size={16} /> Bientôt fini
                </span>
              </div>
            )}
            {offer.images?.[0] ? (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/images/files/${offer.images?.[0]?.name}`}
                alt={offer.name}
                className='size-48 object-cover rounded-lg pointer-events-none'
              />
            ) : (
              <div className='size-48 bg-purple-100 rounded-lg flex items-center justify-center'>
                <img src={logo} alt='' className='w-1/3' />
              </div>
            )}
          </div>

          <div className='flex-1 space-y-2'>
            <h2 className='text-xl font-bold text-purple-dark'>{offer.name}</h2>
            <p className='text-gray-600'>{offer.description}</p>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-gray-500'>Prix:</span>
                <span className='ml-2 font-bold'>{offer.price}€</span>
              </div>
              {offer.quantity && (
                <div>
                  <span className='text-gray-500'>Quantité:</span>
                  <span className='ml-2'>{offer.quantity}</span>
                </div>
              )}
            </div>
            {offer.seller && (
              <div>
                <UserCardLink user={offer.seller}>
                  <div className='flex items-center flex-nowrap'>
                    <span className='text-gray-600'>
                      {offer.seller.first_name || ''}{' '}
                      {offer.seller.last_name || ''}
                    </span>
                    {offer.seller.averageRating && (
                      <span className='ml-2 text-gray-500 text-sm flex items-center flex-nowrap'>
                        {offer.seller.averageRating.toFixed(2)}
                        <Star className='fill-purple-semi-dark stroke-purple-dark w-3 ml-0.5' />
                      </span>
                    )}
                  </div>
                </UserCardLink>
              </div>
            )}

            <div className='mt-4'>
              <Button className='w-full' onClick={goToProduct}>
                Plus de details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
