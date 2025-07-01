import { useNavigate, useParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileAppBar from '@/components/ProfileAppBar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useUserReviews } from '@/api/Review';
import UserReviewCard from '@/components/UserReviewCard';

const ReviewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: userReviews, isLoading } = useUserReviews(Number(id), 150, 0);

  return (
    <div className='min-h-screen pb-20 relative bg-gray-100'>
      <ProfileAppBar>
        <div className='relative flex items-center size-full justify-center'>
          <Button
            variant='ghost'
            className='absolute left-3 p-1'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className='size-8 text-purple-dark' />
          </Button>
          <h1 className='font-bold text-xl'>Ses offres</h1>
        </div>
      </ProfileAppBar>

      <div className='max-w-md mx-auto px-4 mt-6'>
        {isLoading ? (
          <div className='space-y-4'>
            <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
            <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
            <Skeleton className='h-24 bg-gray-200 w-full rounded-lg' />
          </div>
        ) : (
          <div className='space-y-4'>
            {userReviews && userReviews.length > 0 ? (
              userReviews.map((review) => (
                <UserReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className='text-center py-8'>
                <p className='text-gray-500 mb-4'>
                  Cet utilisateur n'a pas reçu d'avis.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
