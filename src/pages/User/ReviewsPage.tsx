import { useParams } from 'react-router';
import { useUserReviews } from '@/api/Review';
import { useUserData } from '@/api/User';
import UserReviewCard from '@/components/UserReviewCard';
import PageLayout from '@/components/layouts/PageLayout';
import ListContainer from '@/components/lists/ListContainer';

const ReviewsPage = () => {
  const { id } = useParams();

  const { data: userReviews, isLoading } = useUserReviews(Number(id), 150, 0);
  const { isLoading: isLoadingUserData, data: userData } = useUserData();

  const isOwnProfile = userData?.id === Number(id);
  const emptyMessage = isOwnProfile
    ? "Vous n'avez pas encore reçu d'avis."
    : "Cet utilisateur n'a pas reçu d'avis.";

  return (
    <PageLayout title='Avis reçus'>
      <ListContainer
        isLoading={isLoading || isLoadingUserData}
        items={userReviews}
        renderItem={(review) => (
          <UserReviewCard key={review.id} review={review} />
        )}
        emptyMessage={emptyMessage}
      />
    </PageLayout>
  );
};

export default ReviewsPage;
