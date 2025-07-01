import { Review } from "@/api/Review";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Star, Flag, MoreVertical } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReviewCardProps {
  review: Review;
  onReport?: (reviewId: number, reason: string, description?: string) => void;
}

const ReviewCard = ({ review, onReport }: ReviewCardProps) => {
  const [showReportDialog, setShowReportDialog] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleReport = (reason: string, description?: string) => {
    onReport?.(review.id, reason, description);
    setShowReportDialog(false);
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar user={review.reviewer} size="sm" />
            <div>
              <h4 className="font-medium text-sm">
                {review.reviewer.first_name} {review.reviewer.last_name}
              </h4>
              <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowReportDialog(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Flag className="w-4 h-4 mr-2" />
                Signaler
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Note générale:</span>
            <div className="flex items-center gap-1">
              {renderStars(Math.round(review.averageRating))}
              <span className="text-sm text-gray-600 ml-1">
                ({review.averageRating.toFixed(1)}/5)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Respect du rendez-vous:</span>
              <div className="flex items-center gap-1">
                {renderStars(review.appointmentRespectRating)}
              </div>
            </div>
            <div className="flex justify-between">
              <span>Amabilité:</span>
              <div className="flex items-center gap-1">
                {renderStars(review.friendlinessRating)}
              </div>
            </div>
            {review.productQualityRating && (
              <div className="flex justify-between">
                <span>Qualité du produit:</span>
                <div className="flex items-center gap-1">
                  {renderStars(review.productQualityRating)}
                </div>
              </div>
            )}
          </div>
        </div>

        {review.comment && (
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
            "{review.comment}"
          </p>
        )}
      </div>

      {showReportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h3 className="font-semibold mb-4">Signaler ce commentaire</h3>
            <p className="text-sm text-gray-600 mb-4">
              Voulez-vous signaler ce commentaire comme inapproprié ?
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReportDialog(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  handleReport('inappropriate', 'Commentaire signalé depuis l\'interface');
                  setShowReportDialog(false);
                }}
                className="flex-1"
              >
                Signaler
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;
