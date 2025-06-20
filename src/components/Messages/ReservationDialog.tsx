import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

interface ReservationDialogProps {
  isOpen: boolean;
  isSuccess: boolean;
  isPurchasing: boolean;
  offerName?: string;
  offerPrice?: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCloseSuccess: () => void;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
  isOpen,
  isSuccess,
  isPurchasing,
  offerName,
  offerPrice,
  onOpenChange,
  onConfirm,
  onCloseSuccess,
}) => {
  if (isSuccess) {
    return (
      <Dialog open={isSuccess} onOpenChange={onCloseSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Réservation effectuée avec succès
            </DialogTitle>
            <DialogDescription>
              <p className="mt-2">
                Votre réservation a été enregistrée. Le vendeur doit maintenant la confirmer.
              </p>
              
              <p className="mt-2">
                Une notification lui a été envoyée. Vous recevrez une confirmation 
                dès que le vendeur aura accepté la réservation.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onCloseSuccess}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la réservation</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de réserver {offerName}
            {offerPrice && offerPrice > 0 ? 
              ` pour un montant de ${offerPrice}€` : 
              ' (offre gratuite)'}. 
                
            <p className="mt-2">
              Une fois la réservation effectuée, le vendeur devra la confirmer. Vous pourrez 
              ensuite convenir d'un lieu et d'une heure de rendez-vous via la messagerie.
            </p>
            
            <p className="mt-2">
              {offerPrice && offerPrice > 0 ? 
                "Après confirmation du vendeur, vous serez redirigé vers la page de paiement." : 
                "Aucun paiement ne sera nécessaire pour cette offre gratuite."}
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onConfirm} disabled={isPurchasing}>
            {isPurchasing ? "Chargement..." : "Confirmer la réservation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
