import { Product, Transaction } from "@/api/Product";
import { useUserData } from "@/api/User";
import { useCancelReservationMutation, useConfirmReservationMutation, useGeneratedQRCodeToken, useReserveProductMutation, useTransactionPaymentLink, validateQRCode } from "@/api/Paiement";
import { User } from "@/api/Message";
import { useLocation } from "react-router";
import CustomQRCode from "@/components/CustomQRCode";
import QRCodeScanner from "@/components/QRCodeScanner";
import ReviewDialog from "@/components/ReviewDialog";
import { useState } from "react";
import ActionBanner from "./ActionBanner";
import { useMemo } from "react";

interface ProductActionsProps {
    product: Product;
    transactions: Transaction[];
    otherParticipant?: User;
    selectedId?: number;
}

const ProductActions = ({ product, transactions, otherParticipant, selectedId }: ProductActionsProps) => {
    const userData = useUserData();
    const isSeller = userData?.data?.id === product.seller.id;
    const hasBuyer = product.buyer !== null;
    const [showReviewDialog, setShowReviewDialog] = useState(false);

    const location = useLocation();
    const redirectURI = location.pathname + (selectedId ? `?conversation=${selectedId}` : '');

    const lastTransaction = transactions[transactions.length - 1];
    const isReserved = lastTransaction?.status === 'reserved';
    const isConfirmed = lastTransaction?.status === 'confirmed';
    const isPending = lastTransaction?.status === 'pending';
    const isCompleted = lastTransaction?.status === 'completed';

    const hasToPay = useMemo(() => !isSeller && hasBuyer && isConfirmed && otherParticipant && otherParticipant.id === product.seller.id, [isSeller, hasBuyer, isConfirmed, otherParticipant, product.seller.id]);
    const generateQRCode = useMemo(() => !isSeller && hasBuyer && isPending && otherParticipant && otherParticipant.id === product.seller.id, [isSeller, hasBuyer, isPending, otherParticipant, product.seller.id]);

    const reserveProductMutation = useReserveProductMutation();
    const confirmReservationMutation = useConfirmReservationMutation();
    const cancelReservationMutation = useCancelReservationMutation();
    const { data: paymentLink, isLoading } = useTransactionPaymentLink(lastTransaction?.id || 0, redirectURI, hasToPay);
    const { data: qrCodeUrl } = useGeneratedQRCodeToken(lastTransaction?.id || 0, generateQRCode);

    const handleScan = (value: string) => {
        if (value.startsWith(import.meta.env.VITE_BACKEND_URL)) {
            validateQRCode(value);
        }
    }

    if (!isSeller && !hasBuyer) {
        return <ActionBanner
            title="Intéressé par ce produit ?"
            description="Réservez-le dès maintenant !"
            buttonAction={() => reserveProductMutation.mutate(product.id)}
            buttonText="Réserver"
        />
    }

    if (!isSeller && hasBuyer && isReserved && otherParticipant && otherParticipant.id === product.seller?.id) {
        return <ActionBanner
            title="Vous avez réservé ce produit !"
            description={`${otherParticipant.first_name} ${otherParticipant.last_name} a maintenant 72 heures pour accepter.`}
            buttonAction={() => cancelReservationMutation.mutate(lastTransaction.id)}
            buttonText="Annuler"
        />;
    }

    if (isSeller && hasBuyer && isReserved && otherParticipant && otherParticipant.id === product.buyer?.id) {
        return <ActionBanner
            title={`${otherParticipant.first_name} ${otherParticipant.last_name} souhaite réserver ce produit.`}
            buttonAction={() => confirmReservationMutation.mutate(lastTransaction.id)}
            buttonText="Confirmer la réservation"
        />
    }

    if (isSeller && hasBuyer && isConfirmed && otherParticipant && otherParticipant.id === product.buyer?.id) {
        return <ActionBanner
            title={`Vous avez confirmé la réservation de ${otherParticipant.first_name} ${otherParticipant.last_name}`}
            description={`${otherParticipant.first_name} ${otherParticipant.last_name} a maintenant 72 heures pour payer.`}
            buttonAction={() => cancelReservationMutation.mutate(lastTransaction.id)}
            buttonText="Annuler"
        />
    }

    if (hasToPay) {
        return <ActionBanner
            title={`${otherParticipant?.first_name} ${otherParticipant?.last_name} à confirmé votre réservation !`}
            description="Vous pouvez maintenant payer le produit."
            buttonAction={() => window.location.href = paymentLink || ''}
            buttonDisabledWhile={isLoading || !paymentLink}
            buttonText="Acheter"
        />
    }

    if (generateQRCode) {
        return (
            <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    <p className="text-gray-600">Merci ! Vous avez payé pour ce produit !</p>
                    <p className="text-gray-600">Au moment de votre rencontre, le vendeur devra scanner le QR code ci-dessous.</p>
                </div>
                {qrCodeUrl && <CustomQRCode value={qrCodeUrl} size={150} />}
            </div>
        );
    }

    if (isSeller && hasBuyer && isPending && otherParticipant && otherParticipant.id === product.buyer?.id) {
        return (
            <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    <p className="text-gray-600">{otherParticipant.first_name} {otherParticipant.last_name} à payer pour le produit</p>
                    <p className="text-gray-600">Vous devez maintenant scanner son QR Code.</p>
                </div>
                <QRCodeScanner onScan={handleScan} />
            </div>
        );
    }

    if (!isSeller && hasBuyer && isCompleted && otherParticipant && otherParticipant.id === product.seller?.id) {
        return <>
            <ActionBanner
                title={`Bravo ! Vous avez acheté ${product.name} pour ${lastTransaction.amount}€`}
                description="Vous pouvez laisser un avis sur le vendeur !"
                buttonAction={() => setShowReviewDialog(true)}
                buttonText="Laisser un avis"
            />
            {
                showReviewDialog && otherParticipant && (
                    <ReviewDialog
                        isOpen={showReviewDialog}
                        onClose={() => setShowReviewDialog(false)}
                        transaction={lastTransaction}
                        product={product}
                        otherParticipant={otherParticipant}
                        isBuyer={!isSeller}
                    />
                )
            }
        </>
    }

    if (isSeller && hasBuyer && isCompleted && otherParticipant && otherParticipant.id === product.buyer?.id) {
        return <>
            <ActionBanner
                title={`Merci d'avoir vendu votre produit !`}
                description="Vous pouvez laisser un avis sur l'acheteur !"
                buttonAction={() => setShowReviewDialog(true)}
                buttonText="Laisser un avis"
            />
            {showReviewDialog && otherParticipant && (
                <ReviewDialog
                    isOpen={showReviewDialog}
                    onClose={() => setShowReviewDialog(false)}
                    transaction={lastTransaction}
                    product={product}
                    otherParticipant={otherParticipant}
                    isBuyer={!isSeller}
                />
            )}
        </>
    }

}


export default ProductActions;