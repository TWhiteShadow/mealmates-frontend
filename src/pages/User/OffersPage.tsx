import { useParams, useNavigate } from 'react-router';
import { useUserOffers } from '@/api/Product';
import OrderCard from '@/components/OrderCard';
import PageLayout from '@/components/layouts/PageLayout';
import ListContainer from '@/components/lists/ListContainer';

const OffersPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: userProductsData, isLoading } = useUserOffers(
    Number(id),
    150,
    0
  );

  return (
    <PageLayout title='Ses offres'>
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
        emptyMessage="Cet utilisateur n'a pas d'offres publiées."
      />
    </PageLayout>
  );
};

export default OffersPage;
