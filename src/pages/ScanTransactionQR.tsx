import { FC, useState } from 'react';
import { useNavigate } from 'react-router';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Camera, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { verifyQrCode, completeTransactionByQrCode } from '@/api/Payment';

const ScanTransactionQR: FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const qrBoxSize = 250;

  const startScanner = () => {
    setIsScanning(true);
    const html5QrCode = new Html5Qrcode("qr-reader");
    
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: qrBoxSize, height: qrBoxSize },
      },
      async (decodedText) => {
        try {
          await html5QrCode.stop();
          setIsScanning(false);

          const verificationResult = await verifyQrCode(decodedText);
          
          if (verificationResult && verificationResult.success) {
            setScannedResult(verificationResult.transaction);
          } else {
            toast.error("QR code invalide ou expiré");
          }
        } catch (error) {
          console.error("Erreur lors du scan du QR code:", error);
          toast.error("Erreur de lecture du QR code");
          setIsScanning(false);
          await html5QrCode.stop();
        }
      },
      (errorMessage) => {
        // Gérer les erreurs du scanner ici, mais ne pas les afficher à l'utilisateur
        console.error(errorMessage);
      }
    ).catch((err) => {
      console.error("Erreur lors de l'initialisation du scanner:", err);
      toast.error("Impossible d'accéder à la caméra");
      setIsScanning(false);
    });
  };

  const confirmTransactionWithQR = async () => {
    if (!scannedResult || !scannedResult.id) {
      toast.error("Données de transaction manquantes");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Appel à l'API pour finaliser la transaction avec le QR code
      const success = await completeTransactionByQrCode(scannedResult.id);
      
      if (success) {
        toast.success("Transaction confirmée avec succès!");
        setScanCompleted(true);
      } else {
        toast.error("Échec de la confirmation de la transaction");
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation de la transaction:", error);
      toast.error("Une erreur est survenue lors de la confirmation de la transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleBackToMessages = () => {
    navigate('/messages');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Scanner le QR Code</CardTitle>
          <CardDescription className="text-center">
            {!scannedResult 
              ? "Scannez le QR code présenté par l'acheteur pour finaliser la transaction" 
              : "Vérification des informations de transaction"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6 space-y-4">
          {!scannedResult ? (
            <>
              <div 
                id="qr-reader" 
                className={`w-full max-w-[${qrBoxSize}px] h-[${qrBoxSize}px] overflow-hidden ${isScanning ? '' : 'hidden'}`}
              ></div>
              
              {!isScanning && (
                <Button 
                  onClick={startScanner}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Commencer le scan
                </Button>
              )}
            </>
          ) : scanCompleted ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <div className="space-y-2">
                <p className="font-semibold text-xl">Transaction confirmée !</p>
                <p className="text-gray-500">
                  La transaction a été validée avec succès et l'acheteur a reçu une confirmation.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p><span className="font-semibold">Offre:</span> {scannedResult?.offer?.name}</p>
                <p><span className="font-semibold">Acheteur:</span> {scannedResult?.buyer?.fullname}</p>
                <p><span className="font-semibold">Montant:</span> {scannedResult?.amount}€</p>
              </div>
              
              <Button 
                onClick={confirmTransactionWithQR}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirmation en cours...
                  </>
                ) : (
                  "Confirmer la transaction"
                )}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {scanCompleted ? (
            <Button 
              onClick={handleBackToMessages}
              className="w-full"
              variant="outline"
            >
              Retour aux messages
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ScanTransactionQR;
