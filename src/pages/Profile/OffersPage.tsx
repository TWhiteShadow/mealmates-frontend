import { useNavigate } from 'react-router';
import { useAllUserProducts } from '@/api/Product';
import OrderCard from '@/components/OrderCard';
import PageLayout from '@/components/layouts/PageLayout';
import ListContainer from '@/components/lists/ListContainer';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OffersPage = () => {
  const { data: userProductsData, isLoading } = useAllUserProducts();
  const navigate = useNavigate();

  return (
    <PageLayout
      title='Mes offres'
      rightAction={{
        icon: <Plus className='size-8 text-purple-dark' />,
        onClick: () => navigate('/app/sell'),
      }}
    >
      <ListContainer
        isLoading={isLoading}
        items={userProductsData}
        renderItem={(product) => (
          <OrderCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/app/product/${product.id}`)}
          />
        )}
        emptyMessage={
          <>
            <p className='text-gray-500 mb-4'>
              Vous n'avez pas d'offres publiées.
            </p>
            <Button
              onClick={() => navigate('/app/sell')}
              className='bg-purple-dark hover:bg-purple-dark/90'
            >
              Créer ma première offre
            </Button>
          </>
        }
      />
    </PageLayout>
  );
};

export default OffersPage;
