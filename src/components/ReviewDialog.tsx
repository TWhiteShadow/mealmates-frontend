import React, { useState } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useSubmitTransactionReviewMutation, ReviewData } from '@/api/Paiement';
import { Product, Transaction } from '@/api/Product';
import { User } from '@/api/Message';
import UserAvatar from '@/components/UserAvatar';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  product: Product;
  otherParticipant: User;
  isBuyer: boolean;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  isOpen,
  onClose,
  transaction,
  product,
  otherParticipant,
  isBuyer
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [productQualityRating, setProductQualityRating] = useState<number>(0);
  const [appointmentRespectRating, setAppointmentRespectRating] = useState<number>(0);
  const [friendlinessRating, setFriendlinessRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const submitReviewMutation = useSubmitTransactionReviewMutation();;

  const steps = isBuyer ? [
    {
      key: 'productQuality',
      title: 'Comment était la qualité du produit ?',
      subtitle: 'Votre avis nous aide à améliorer la qualité des offres',
      rating: productQualityRating,
      setRating: setProductQualityRating
    },
    {
      key: 'appointmentRespect',
      title: 'Le vendeur a-t-il respecté le rendez-vous ?',
      subtitle: 'Ponctualité et respect des horaires convenus',
      rating: appointmentRespectRating,
      setRating: setAppointmentRespectRating
    },
    {
      key: 'friendliness',
      title: 'Comment s\'est passé l\'échange ?',
      subtitle: 'Amabilité et courtoisie du vendeur',
      rating: friendlinessRating,
      setRating: setFriendlinessRating
    }
  ] : [
    {
      key: 'appointmentRespect',
      title: 'L\'acheteur a-t-il respecté le rendez-vous ?',
      subtitle: 'Ponctualité et respect des horaires convenus',
      rating: appointmentRespectRating,
      setRating: setAppointmentRespectRating
    },
    {
      key: 'friendliness',
      title: 'Comment s\'est passé l\'échange ?',
      subtitle: 'Amabilité et courtoisie de l\'acheteur',
      rating: friendlinessRating,
      setRating: setFriendlinessRating
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === (steps.length - 1);
  const canGoNext = currentStepData.rating > 0;

  const handleStarClick = (rating: number) => {
    currentStepData.setRating(rating);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(step => step + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const handleSubmit = async () => {
    const reviewData: ReviewData = {
      appointmentRespectRating,
      friendlinessRating,
      ...(isBuyer && { productQualityRating })
    };

    try {
      await submitReviewMutation.mutateAsync({ transactionId: transaction.id, reviewData });
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Très décevant';
      case 2: return 'Décevant';
      case 3: return 'Correct';
      case 4: return 'Bien';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  const currentRating = hoveredRating || currentStepData.rating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full mx-auto p-0 overflow-hidden bg-white rounded-2xl sm:rounded-2xl shadow-2xl border-0 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">
          Donnez votre avis sur cette transaction
        </DialogTitle>

        <div className="bg-purple-dark text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-white/10 rounded-full -translate-y-10 sm:-translate-y-16 translate-x-10 sm:translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-14 sm:w-24 h-14 sm:h-24 bg-white/5 rounded-full translate-y-7 sm:translate-y-12 -translate-x-7 sm:-translate-x-12"></div>
          
          <div className="mb-6 relative z-10">
            <div className="flex justify-between text-sm mb-3 text-purple-100">
              <span className="font-medium">Étape {currentStep + 1} sur {steps.length}</span>
              <span className="font-medium">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 sm:h-3 overflow-hidden backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-white to-purple-100 rounded-full h-2.5 sm:h-3 transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="relative flex-shrink-0">
              <UserAvatar user={otherParticipant} size="sm" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-lg truncate">
                {otherParticipant.first_name} {otherParticipant.last_name}
              </h3>
              <p className="text-purple-100 text-sm font-medium truncate">
                {isBuyer ? 'Vendeur' : 'Acheteur'} • {product.name}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:p-8 flex-1 overflow-y-auto">
          <div className="text-center space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                {currentStepData.subtitle}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center gap-1 sm:gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-2 sm:p-3 transition-all duration-200 hover:scale-110 active:scale-95 rounded-full hover:bg-purple-50 touch-manipulation"
                  >
                    <Star
                      className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200",
                        currentRating >= star
                          ? "fill-purple-semi-dark stroke-purple-dark drop-shadow-sm"
                          : "stroke-gray-300 hover:stroke-gray-400"
                      )}
                    />
                  </button>
                ))}
              </div>

              <div className="h-8 flex items-center justify-center">
                <p className={cn(
                  "text-lg font-semibold transition-all duration-200",
                  currentRating > 0 ? "text-purple-dark opacity-100" : "opacity-0"
                )}>
                  {getRatingText(currentRating)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 sm:px-8 sm:py-6 flex flex-col-reverse sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center border-t flex-shrink-0">
          <Button
            onClick={currentStep === 0 ? onClose : handleBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800 hover:bg-white/80 font-medium px-6 py-3 rounded-xl transition-all duration-200 w-full sm:w-auto"
          >
            {currentStep === 0 ? (
              'Annuler'
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </>
            )}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canGoNext || submitReviewMutation.isPending}
            className={cn(
              "font-medium px-6 py-3 rounded-xl w-full sm:w-auto",
              canGoNext && !submitReviewMutation.isPending
                ? "bg-purple-dark hover:bg-purple-800 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            {submitReviewMutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Envoi...
              </div>
            ) : isLastStep ? (
              'Terminer'
            ) : (
              <>
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
