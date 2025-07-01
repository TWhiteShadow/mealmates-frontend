import { useNavigate } from 'react-router';
import { useUserBoughtProducts } from '@/api/Product';
import OrderCard from '@/components/OrderCard';
import PageLayout from '@/components/layouts/PageLayout';
import ListContainer from '@/components/lists/ListContainer';

const OrdersPage = () => {
  const { data: userBoughtProductsData, isLoading } = useUserBoughtProducts();
  const navigate = useNavigate();

  return (
    <PageLayout title='Mes commandes'>
      <ListContainer
        isLoading={isLoading}
        items={userBoughtProductsData}
        renderItem={(product) => (
          <OrderCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/app/product/${product.id}`)}
          />
        )}
        emptyMessage="Vous n'avez pas encore passé de commandes."
      />
    </PageLayout>
  );
};

export default OrdersPage;
