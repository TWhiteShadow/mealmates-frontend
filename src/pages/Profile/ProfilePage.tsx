import ProfileAppBar from '@/components/ProfileAppBar';
import OrderCard from '@/components/OrderCard';
import StatCard from '@/components/StatCard';
import { useNavigate } from 'react-router';
import { useUserData, useUserStats } from '@/api/User';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/UserAvatar';
import { useAllUserProducts, useUserBoughtProducts } from '@/api/Product';
import {
  PackageOpen,
  PiggyBank,
  SettingsIcon,
  ShoppingCart,
  Star,
} from 'lucide-react';

const ProfilePage = () => {
  const { isLoading: isLoadingUserData, data: userData } = useUserData();

  const { isLoading: isLoadingUserProductsData, data: userProductsData } =
    useAllUserProducts();

  const {
    isLoading: isLoadingUserBoughtProductsData,
    data: userBoughtProductsData,
  } = useUserBoughtProducts();

  const { isLoading: isLoadingUserStats, data: userStats } = useUserStats(
    userData?.id || 0,
    isLoadingUserData
  );

  const navigate = useNavigate();

  const handleSettings = () => {
    navigate('/app/profile/settings');
  };

  return (
    <div className='min-h-screen pb-20 relative bg-gray-100'>
      <ProfileAppBar>
        <div className='flex items-center gap-3'>
          {!isLoadingUserData ? (
            <>
              <UserAvatar user={userData} size='md' />
              <span className='font-semibold text-lg'>
                {userData?.first_name + ' ' + userData?.last_name}
              </span>
            </>
          ) : (
            <>
              <Skeleton className='h-12 w-12 rounded-full' />{' '}
              <Skeleton className='h-4 w-[250px]' />
            </>
          )}
        </div>
        <button onClick={handleSettings}>
          <SettingsIcon className='text-purple-dark size-7' />
        </button>
      </ProfileAppBar>
      <div className='max-w-md mx-auto px-4'>
        <section className='my-8'>
          <div className='grid grid-cols-2 gap-4'>
            <StatCard
              title='Note moyenne'
              value={
                !isLoadingUserStats && userData?.averageRating
                  ? userData?.averageRating.toFixed(2)
                  : '0.0'
              }
              unit='/5'
              isLoading={isLoadingUserStats}
              className='text-purple-dark'
              icon={<Star className='size-[80px]' />}
            />
            <StatCard
              title='Porte-monnaie'
              value={
                !isLoadingUserStats && userStats?.totalEarnings !== undefined
                  ? userStats?.totalEarnings.toFixed(2)
                  : '0.00'
              }
              unit='EUR'
              isLoading={isLoadingUserStats}
              className='text-purple-dark '
              icon={<PiggyBank className='size-[80px]' />}
            />
            <StatCard
              title='Offres vendues'
              value={
                !isLoadingUserStats &&
                userStats?.completedTransactions !== undefined
                  ? userStats?.completedTransactions.toString()
                  : '0'
              }
              unit=''
              isLoading={isLoadingUserStats}
              className='text-purple-dark '
              icon={<PackageOpen className='size-[80px]' />}
            />
            <StatCard
              title='Offres achetées'
              value={
                !isLoadingUserStats &&
                userStats?.boughtTransactions !== undefined
                  ? userStats?.boughtTransactions.toString()
                  : '0'
              }
              unit=''
              isLoading={isLoadingUserStats}
              className='text-purple-dark '
              icon={<ShoppingCart className='size-[80px]' />}
            />
          </div>
        </section>
        <section className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>Vos dernières commandes</h2>
            <button
              onClick={() => navigate('/app/profile/orders')}
              className='text-purple-dark underline-offset-2 underline text-sm'
            >
              Voir plus
            </button>
          </div>
          {isLoadingUserBoughtProductsData ? (
            <div className='space-y-4'>
              <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
              <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
              <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
            </div>
          ) : (
            <div className='space-y-4'>
              {userBoughtProductsData && userBoughtProductsData.length > 0 ? (
                userBoughtProductsData
                  .slice(0, 3)
                  .map((product) => (
                    <OrderCard
                      key={product.id}
                      product={product}
                      onClick={() => navigate(`/app/product/${product.id}`)}
                    />
                  ))
              ) : (
                <p className='text-gray-500'>
                  Vous n'avez pas encore passé de commandes.
                </p>
              )}
            </div>
          )}
        </section>

        <section className='mt-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>Vos offres</h2>
            <button
              onClick={() => navigate('/app/profile/offers')}
              className='text-purple-dark underline-offset-2 underline text-sm'
            >
              Voir plus
            </button>
          </div>

          {isLoadingUserProductsData ? (
            <div className='space-y-4'>
              <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
              <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
              <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
            </div>
          ) : (
            <div className='space-y-4'>
              {userProductsData && userProductsData.length > 0 ? (
                userProductsData
                  .slice(0, 3)
                  .map((product) => (
                    <OrderCard
                      key={product.id}
                      product={product}
                      onClick={() => navigate(`/app/product/${product.id}`)}
                    />
                  ))
              ) : (
                <p className='text-gray-500'>
                  Vous n'avez pas d'offres publiées.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
