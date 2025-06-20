import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { generateQrCode } from '@/api/Payment';


const TransactionQrCode: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/messages');
      return;
    }

    const fetchQrCode = async () => {
      setIsLoading(true);
      try {
        const response = await generateQrCode(parseInt(id));
        
        if (response) {
          setToken(response.token);
          setExpiryTime(new Date(response.expiresAt));
        } else {
          toast.error("Impossible de générer le QR code");
          navigate('/messages');
        }
      } catch (error) {
        toast.error("Erreur lors de la génération du QR code");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQrCode();
  }, [id, navigate, refreshKey]);

  useEffect(() => {
    if (!expiryTime) return;
    
    const interval = setInterval(() => {
      if (Date.now() > expiryTime.getTime()) {
        refreshQrCode();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const refreshQrCode = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    toast.info("QR code actualisé");
  };

  const handleBack = () => {
    navigate('/messages');
  };

  const getTimeRemaining = () => {
    if (!expiryTime) return "0:00";
    
    const totalSeconds = Math.max(0, Math.floor((expiryTime.getTime() - Date.now()) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">QR Code de transaction</CardTitle>
          <CardDescription className="text-center">
            Montrez ce QR code au vendeur pour finaliser la transaction
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6 space-y-4">
          {isLoading ? (
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
          ) : (
            <>
              <div className="border-4 border-white shadow-md rounded-lg p-2 bg-white">
                <QRCodeSVG 
                  value={token} 
                  size={200} 
                  level="H" 
                  marginSize={4}
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">
                  Ce QR code expire dans <span className="font-semibold">{getTimeRemaining()}</span>
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshQrCode}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Actualiser
                </Button>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TransactionQrCode;
