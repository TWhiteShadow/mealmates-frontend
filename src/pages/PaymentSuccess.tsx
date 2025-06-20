import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { checkPaymentSuccess } from '@/api/Payment';
import { Loader2, CheckCircle, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [offerId, setOfferId] = useState<string | null>(null);

  useEffect(() => {
    const offerIdParam = searchParams.get('offer_id');
    const sessionId = searchParams.get('session_id');
    
    if (!offerIdParam || !sessionId) {
      toast.error('Paramètres manquants pour vérifier le paiement');
      navigate('/messages');
      return;
    }

    setOfferId(offerIdParam);

    const verifyPayment = async () => {
      try {
        const success = await checkPaymentSuccess(parseInt(offerIdParam), sessionId);
        
        if (success) {
          toast.success('Votre réservation a été effectuée avec succès!');
        } else {
          toast.error('Impossible de vérifier votre paiement');
          navigate('/messages');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error);
        toast.error('Une erreur est survenue lors de la vérification du paiement');
        navigate('/messages');
      } finally {
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [navigate, searchParams]);

  const handleViewQrCode = () => {
    navigate(`/transaction/complete/${offerId}`);
  };

  const handleGoToMessages = () => {
    navigate('/messages');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {isProcessing ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Finalisation de votre réservation</CardTitle>
            <CardDescription className="text-center">
              Veuillez patienter pendant que nous confirmons votre paiement
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Réservation confirmée !
            </CardTitle>
            <CardDescription className="text-center">
              Votre réservation a été effectuée avec succès
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="space-y-4 text-center">
              <p>
                Vous pouvez maintenant contacter le vendeur pour convenir d'un lieu et d'une heure de rendez-vous.
              </p>
              <p>
                Lors de la rencontre, montrez le QR code au vendeur pour qu'il puisse valider la transaction.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button onClick={handleViewQrCode}
            className="w-full flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Afficher mon QR code
            </Button>
            <Button onClick={handleGoToMessages}
            variant="outline" className="w-full">
              Retour aux messages
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PaymentSuccess;
