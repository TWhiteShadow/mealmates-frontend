import React, { useState } from 'react';
import { Star, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSubmitTransactionReviewMutation, ReviewData } from '@/api/Paiement';
import { Product, Transaction } from '@/api/Product';
import { User } from '@/api/Message';
import UserAvatar from '@/components/UserAvatar';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  offer: Product;
  otherParticipant: User;
  isBuyer: boolean;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  isOpen,
  onClose,
  transaction,
  offer,
  otherParticipant,
  isBuyer
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [productQualityRating, setProductQualityRating] = useState<number>(0);
  const [appointmentRespectRating, setAppointmentRespectRating] = useState<number>(0);
  const [friendlinessRating, setFriendlinessRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const submitReviewMutation = useSubmitTransactionReviewMutation();

  // Define steps based on user type
  const steps = isBuyer 
    ? [
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
      ]
    : [
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
  const isLastStep = currentStep === steps.length - 1;
  const canGoNext = currentStepData.rating > 0;

  const handleStarClick = (rating: number) => {
    currentStepData.setRating(rating);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
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
      toast.success('Avis soumis avec succès !');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la soumission de l\'avis');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-purple-dark text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Étape {currentStep + 1} sur {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <UserAvatar user={otherParticipant} size="sm" />
            <div>
              <h3 className="font-medium text-white">
                {otherParticipant.first_name} {otherParticipant.last_name}
              </h3>
              <p className="text-purple-100 text-sm">
                {isBuyer ? 'Vendeur' : 'Acheteur'} • {offer.name}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Star Rating */}
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-2 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "w-10 h-10 transition-colors",
                        (hoveredRating || currentStepData.rating) >= star
                          ? "fill-purple-dark stroke-purple-dark"
                          : "stroke-gray-300"
                      )}
                    />
                  </button>
                ))}
              </div>
              
              {/* Rating Text */}
              {(hoveredRating || currentStepData.rating) > 0 && (
                <p className="text-purple-dark font-medium">
                  {getRatingText(hoveredRating || currentStepData.rating)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <Button
            onClick={currentStep === 0 ? onClose : handleBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
          >
            {currentStep === 0 ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </>
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
            className="bg-purple-dark hover:bg-purple-dark/90 text-white"
          >
            {submitReviewMutation.isPending ? (
              'Envoi...'
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
      </div>
    </div>
  );
};

export default ReviewDialog;