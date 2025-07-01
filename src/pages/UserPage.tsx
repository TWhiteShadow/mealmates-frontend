import { useUserById, useUserStats } from '@/api/User';
import { useUserOffers } from '@/api/Product';
import ProfileAppBar from '@/components/ProfileAppBar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import StatCard from '@/components/StatCard';
import OrderCard from '@/components/OrderCard';
import UserReviewCard from '@/components/UserReviewCard';
import { ChevronLeft, Star, ShoppingCart } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { useUserReviews } from '@/api/Review';

const UserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useUserById(Number(id));
  const { data: userStats, isLoading: isLoadingUserStats } = useUserStats(
    Number(id),
    isLoading
  );
  const { data: userOffers, isLoading: isLoadingOffers } = useUserOffers(
    Number(id),
    3,
    0
  );
  const { data: userReviews, isLoading: isLoadingReviews } = useUserReviews(
    Number(id),
    5,
    0
  );

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark'></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-red-500'>
          Impossible de charger les données de cet utilisateur
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen pb-20 relative bg-gray-100'>
      <ProfileAppBar>
        <div className='relative flex items-center size-full justify-center'>
          <Button
            type='button'
            variant='ghost'
            className='absolute left-3 p-1'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className='size-8 text-purple-dark' />
          </Button>
          <span className='text-lg font-Lilita font-bold text-purple-dark'>
            {user.first_name || ''} {user.last_name || ''}
          </span>
        </div>
      </ProfileAppBar>

      <div className='max-w-md mx-auto px-4'>
        <section className='my-8'>
          <div className='grid grid-cols-2 gap-4'>
            <StatCard
              title='Note moyenne'
              value={
                !isLoading && user?.averageRating
                  ? user.averageRating.toFixed(2)
                  : '0.0'
              }
              unit='/5'
              isLoading={isLoading}
              className='text-purple-dark'
              icon={<Star className='size-[80px]' />}
            />
            <StatCard
              title='Total transactions'
              value={
                !isLoadingUserStats &&
                userStats?.completedTransactions !== undefined
                  ? userStats.completedTransactions.toString()
                  : '0'
              }
              unit=''
              isLoading={isLoadingUserStats}
              className='text-purple-dark'
              icon={<ShoppingCart className='size-[80px]' />}
            />
          </div>
        </section>

        <section className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>Avis clients</h2>
            <Link
              to={`/app/user/${id}/reviews`}
              className='text-purple-dark underline-offset-2 underline text-sm'
            >
              Voir plus
            </Link>
          </div>

          {isLoadingReviews ? (
            <div className='space-y-4'>
              <Skeleton className='h-32 bg-gray-200 w-full rounded-lg' />
              <Skeleton className='h-32 bg-gray-200 w-full rounded-lg' />
              <Skeleton className='h-32 bg-gray-200 w-full rounded-lg' />
            </div>
          ) : (
            <div className='space-y-4'>
              {userReviews && userReviews.length > 0 ? (
                userReviews
                  .slice(0, 3)
                  .map((review) => (
                    <UserReviewCard key={review.id} review={review} />
                  ))
              ) : (
                <p className='text-gray-500 text-center py-8'>
                  Aucun avis pour le moment.
                </p>
              )}
            </div>
          )}
        </section>

        <section className='mt-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>Ses offres</h2>
            <Link
            to={`/app/user/${id}/offers`}
            className='text-purple-dark underline-offset-2 underline text-sm'
            >
              Voir plus
            </Link>
          </div>

          {isLoadingOffers ? (
            <div className='space-y-4'>
              <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
              <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
              <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
            </div>
          ) : (
            <div className='space-y-4'>
              {userOffers && userOffers.length > 0 ? (
                userOffers
                  .slice(0, 3)
                  .map((product) => (
                    <OrderCard
                      key={product.id}
                      product={product}
                      onClick={() => navigate(`/app/product/${product.id}`)}
                    />
                  ))
              ) : (
                <p className='text-gray-500 text-center py-8'>
                  Aucune offre disponible.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserPage;
