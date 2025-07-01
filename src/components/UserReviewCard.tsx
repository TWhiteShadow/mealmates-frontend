import { useState } from 'react';
import { Flag, Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Review, useReportReviewMutation } from '@/api/Review';
import UserAvatar from './UserAvatar';

interface UserReviewCardProps {
  review: Review;
}

const UserReviewCard = ({ review }: UserReviewCardProps) => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const reportMutation = useReportReviewMutation();

  const handleReport = () => {
    if (!reportReason) {
      toast.error('Veuillez sélectionner une raison');
      return;
    }

    reportMutation.mutate(
      {
        reviewId: review.id,
        reportData: {
          reason: reportReason,
          description: reportDescription,
        }
      },
      {
        onSuccess: () => {
          setShowReportDialog(false);
          setReportReason('');
          setReportDescription('');
        },
        onError: () => {
          toast.error('Erreur lors de l\'envoi du signalement');
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
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        );
      } else if (rating > i && rating < i + 1) {
        stars.push(
          <StarHalf
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        );
        stars.push(
          <Star
            key={i + 100}
            className="w-4 h-4 text-yellow-400"
            style={{ marginLeft: '-20px' }}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 text-gray-300"
          />
        );
      }
    }
    return stars;
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              user={review.reviewer}
              size="md"
              className="w-10 h-10 rounded-full"
              alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
            />
              
            <div>
              <p className="font-medium text-sm">
                {review.reviewer.first_name} {review.reviewer.last_name}
              </p>
              <div className="flex items-center gap-1">
                {renderStars(review.averageRating)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {formatDate(review.createdAt)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReportDialog(true)}
              className="p-1 h-auto text-gray-400 hover:text-red-500"
            >
              <Flag className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {review.offer?.name && (
          <p className="text-gray-700 text-sm leading-relaxed font-bold">
            Offre : <span className='font-normal'>{review.offer?.name}</span>
          </p>
        )}
        <div className='flex items-center gap-2 mt-2 leading-relaxed'>
          {review.productQualityRating && (
            <>
              <p className="text-sm text-gray-600 font-bold">Qualité du produit : <span className='font-normal'>{review.productQualityRating}</span></p>
              <span className='text-sm text-gray-600 font-bold'>|</span>
            </>
          )}
          <p className="text-sm text-gray-600 font-bold">
            Rendez-vous : <span className='font-normal'>{review.appointmentRespectRating}</span>
          </p>
          <span className='text-sm text-gray-600 font-bold'>|</span>
          <p className="text-sm text-gray-600 font-bold">
            Amabilité : <span className='font-normal'>{review.friendlinessRating}</span>
          </p>
        </div>
      </div>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Signaler ce commentaire</DialogTitle>
            <DialogDescription>
              Pourquoi souhaitez-vous signaler ce commentaire ?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Raison du signalement :</Label>
              <div className="space-y-2">
                {[
                  { value: 'spam', label: 'Spam ou contenu indésirable' },
                  { value: 'harassment', label: 'Harcèlement ou intimidation' },
                  { value: 'inappropriate', label: 'Contenu inapproprié' },
                  { value: 'fake', label: 'Faux commentaire' },
                  { value: 'other', label: 'Autre' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reportReason"
                      value={option.value}
                      checked={reportReason === option.value}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReportDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleReport}
              disabled={reportMutation.isPending}
            >
              {reportMutation.isPending ? 'Envoi...' : 'Signaler'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserReviewCard;
