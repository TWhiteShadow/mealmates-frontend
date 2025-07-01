import { useState } from 'react';
import { Flag, Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportDialog from './ReportDialog';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Review, useReportReviewMutation } from '@/api/Review';
import UserCardLink from './UserCardLink';

interface UserReviewCardProps {
  review: Review;
}

const UserReviewCard = ({ review }: UserReviewCardProps) => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const reportMutation = useReportReviewMutation();

  const handleReport = () => {
    reportMutation.mutate(
      {
        reviewId: review.id,
        reportData: {
          reason: reportReason,
          description: reportDescription,
        },
      },
      {
        onSuccess: () => {
          setShowReportDialog(false);
          setReportReason('');
          setReportDescription('');
        },
        onError: () => {
          toast.error("Erreur lors de l'envoi du signalement");
        },
      }
    );
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: fr,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (rating >= i + 1) {
        stars.push(
          <Star key={i} className='w-4 h-4 fill-yellow-400 text-yellow-400' />
        );
      } else if (rating > i && rating < i + 1) {
        stars.push(
          <StarHalf
            key={i}
            className='w-4 h-4 fill-yellow-400 text-yellow-400'
          />
        );
        stars.push(
          <Star
            key={i + 100}
            className='w-4 h-4 text-yellow-400'
            style={{ marginLeft: '-20px' }}
          />
        );
      } else {
        stars.push(<Star key={i} className='w-4 h-4 text-gray-300' />);
      }
    }
    return stars;
  };

  return (
    <>
      <div className='bg-white p-4 rounded-lg shadow-sm border'>
        <div className='flex items-start justify-between mb-1.5'>
          <div className='flex items-center gap-3'>
            <UserCardLink user={review.reviewer}>
              <div className='flex items-center flex-nowrap'>
                <span className='text-gray-600'>
                  {review.reviewer.first_name || ''}{' '}
                  {review.reviewer.last_name || ''}
                </span>
                {review.reviewer.averageRating && (
                  <span className='ml-2 text-gray-500 text-sm flex items-center flex-nowrap'>
                    {review.reviewer.averageRating.toFixed(2)}
                    <Star className='fill-purple-semi-dark stroke-purple-dark w-3 ml-0.5' />
                  </span>
                )}
              </div>
            </UserCardLink>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowReportDialog(true)}
              className='p-1 h-auto text-gray-400 hover:text-red-500'
            >
              <Flag className='w-4 h-4' />
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-1 mb-2'>
          {renderStars(review.averageRating)}
          <span className='ml-2 text-xs text-gray-500'>
            {formatDate(review.createdAt)}
          </span>
        </div>
        {review.offer?.name && (
          <p className='text-gray-700 text-sm leading-relaxed font-bold'>
            Offre : <span className='font-normal'>{review.offer?.name}</span>
          </p>
        )}
        <div className='flex items-center gap-2 mt-2 leading-relaxed flex-wrap'>
          {review.productQualityRating && (
            <>
              <p className='text-sm text-gray-600 font-bold'>
                Qualité du produit :{' '}
                <span className='font-normal'>
                  {review.productQualityRating}
                </span>
              </p>
              <span className='text-sm text-gray-600 font-bold'>|</span>
            </>
          )}
          <p className='text-sm text-gray-600 font-bold'>
            Rendez-vous :{' '}
            <span className='font-normal'>
              {review.appointmentRespectRating}
            </span>
          </p>
          <span className='text-sm text-gray-600 font-bold'>|</span>
          <p className='text-sm text-gray-600 font-bold'>
            Amabilité :{' '}
            <span className='font-normal'>{review.friendlinessRating}</span>
          </p>
        </div>
      </div>

      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        title='Signaler ce commentaire'
        description='Pourquoi souhaitez-vous signaler ce commentaire ?'
        options={[
          { value: 'spam', label: 'Spam ou contenu indésirable' },
          { value: 'harassment', label: 'Harcèlement ou intimidation' },
          { value: 'inappropriate', label: 'Contenu inapproprié' },
          { value: 'fake', label: 'Faux commentaire' },
          { value: 'other', label: 'Autre' },
        ]}
        onReport={(reason) => {
          setReportReason(reason);
          handleReport();
        }}
        isPending={reportMutation.isPending}
      />
    </>
  );
};

export default UserReviewCard;
