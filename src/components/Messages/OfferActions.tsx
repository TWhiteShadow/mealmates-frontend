import { Product, Transaction } from "@/api/Product";
import { useUserData } from "@/api/User";
import { useCancelReservationMutation, useConfirmReservationMutation, useGeneratedQRCodeToken, useReserveProductMutation, useTransactionPaymentLink, validateQRCode } from "@/api/Paiement";
import { User } from "@/api/User";
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

    const lastTransaction = transactions && transactions[transactions.length - 1] || null;
    const isReserved = lastTransaction?.status === 'reserved';
    const isConfirmed = lastTransaction?.status === 'confirmed';
    const isPending = lastTransaction?.status === 'pending';
    const isCompleted = lastTransaction?.status === 'completed';

    const isFree = useMemo(() => product.price === 0, [product.price]);
    const hasToPay = useMemo(() => !isSeller && hasBuyer && isConfirmed && !isFree && otherParticipant && otherParticipant.id === product.seller.id, [isSeller, hasBuyer, isConfirmed, otherParticipant, product.seller.id]);
    const generateQRCode = useMemo(() => !isSeller && hasBuyer && isPending && otherParticipant && otherParticipant.id === product.seller.id, [isSeller, hasBuyer, isPending, otherParticipant, product.seller.id]);
    const hasReviewed = useMemo(() => lastTransaction && lastTransaction.reviews?.some(review => review.reviewer.id === userData?.data?.id && review.status != 'rejected'), [lastTransaction, userData]);

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

    // STEP 1 : Buyer can reserve the product
    if (!isSeller && !hasBuyer) {
        return <ActionBanner
            title="Intéressé par ce produit ?"
            description="Réservez-le dès maintenant !"
            buttons={[{
                action: () => reserveProductMutation.mutate(product.id),
                text: "Réserver"
            }]}
        />
    }

    // STEP 1 : Buyer has reserved the product
    if (!isSeller && hasBuyer && isReserved && otherParticipant && otherParticipant.id === product.seller?.id) {
        return <ActionBanner
            title="Vous avez réservé ce produit !"
            description={`${otherParticipant.first_name} ${otherParticipant.last_name} a maintenant 72 heures pour accepter.`}
            buttons={[{
                action: () => cancelReservationMutation.mutate(lastTransaction.id),
                text: "Annuler",
                variant: "outline"
            }]}
        />;
    }

    // STEP 2 : Seller can confirm the reservation
    if (isSeller && hasBuyer && isReserved && otherParticipant && otherParticipant.id === product.buyer?.id) {
        return <ActionBanner
            title={`${otherParticipant.first_name} ${otherParticipant.last_name} souhaite réserver ce produit.`}
            buttons={[{
                action: () => confirmReservationMutation.mutate(lastTransaction.id),
                text: "Confirmer la réservation"
            },
            {
                action: () => cancelReservationMutation.mutate(lastTransaction.id),
                text: "Annuler",
                variant: "outline"
            }]}
        />
    }

    // STEP 2 : Seller has confirmed the reservation
    // Product is not free
    if (isSeller && hasBuyer && isConfirmed && !isFree && otherParticipant && otherParticipant.id === product.buyer?.id) {
        return <ActionBanner
            title={`Vous avez confirmé la réservation de ${otherParticipant.first_name} ${otherParticipant.last_name}`}
            description={`${otherParticipant.first_name} ${otherParticipant.last_name} a maintenant 72 heures pour payer.`}
            buttons={[{
                action: () => cancelReservationMutation.mutate(lastTransaction.id),
                text: "Annuler",
                variant: "outline"
            }]}
        />
    }
    // Product is free
    if (isSeller && hasBuyer && isConfirmed && isFree && otherParticipant && otherParticipant.id === product.buyer?.id) {
        return <ActionBanner
            title={`Vous avez confirmé la réservation de ${otherParticipant?.first_name} ${otherParticipant?.last_name}`}
            description="Vous pouvez maintenant rencontrer l'acheteur."
        />
    }
    // STEP 3 : Buyer has to pay for the product
    if (hasToPay) {
        return <ActionBanner
            title={`${otherParticipant?.first_name} ${otherParticipant?.last_name} à confirmé votre réservation !`}
            description="Vous pouvez maintenant payer le produit."
            buttons={[{
                action: () => window.location.href = paymentLink || '',
                disabled: isLoading || !paymentLink,
                text: "Acheter"
            }, {
                action: () => cancelReservationMutation.mutate(lastTransaction.id),
                text: "Annuler",
                variant: "outline"
            }]}
        />
    }
    // STEP 4 : Buyer has payed the product and generates QR code
    if (generateQRCode) {
        return (
            <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    {!isFree ? (
                        <p className="text-gray-600">Merci d'avoir payer pour ce produit !</p>
                    ) : (
                        <p className="text-gray-600">Super, vous pouvez maintenant aller chercher le produit !</p>
                    )}
                    <p className="text-gray-600">Au moment de votre rencontre, le vendeur devra scanner le QR code ci-dessous.</p>
                </div>
                {qrCodeUrl && <CustomQRCode value={qrCodeUrl} size={150} />}
            </div>
        );
    }
    // STEP 5 : Seller has to scan the QR code to confirm pickup
    if (isSeller && hasBuyer && isPending && otherParticipant && otherParticipant.id === product.buyer?.id) {
        return (
            <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    {!isFree ? (
                        <p className="text-gray-600">{otherParticipant.first_name} {otherParticipant.last_name} à payer pour le produit.</p>
                    ) : (
                        <p className="text-gray-600">{otherParticipant.first_name} {otherParticipant.last_name} souhaite récupérer le produit !</p>
                    )}
                    <p className="text-gray-600">Vous devez maintenant scanner son QR Code.</p>
                </div>
                <QRCodeScanner onScan={handleScan} />
            </div>
        );
    }
    // STEP 6 : Seller has scanned the QR code and the transaction is completed
    if (isSeller && hasBuyer && isCompleted && otherParticipant && otherParticipant.id === product.buyer?.id && !hasReviewed) {
        return <>
            <ActionBanner
                title={!isFree ? `Merci d'avoir vendu votre produit !` : `Merci d'avoir donné votre produit !`}
                description={`Vous pouvez laisser un avis pour ${otherParticipant.first_name} ${otherParticipant.last_name} !`}
                buttons={[{
                    action: () => setShowReviewDialog(true),
                    text: "Laisser un avis"
                }]}
            />
            {showReviewDialog && otherParticipant && (
                <ReviewDialog
                    isOpen={showReviewDialog}
                    onClose={() => setShowReviewDialog(false)}
                    transactionId={lastTransaction.id}
                    product={product}
                    otherParticipant={otherParticipant}
                    isBuyer={!isSeller}
                />
            )}
        </>
    }
    // STEP 6 : Buyer has confirmation of the transaction and is invited to leave a review
    if (!isSeller && hasBuyer && isCompleted && otherParticipant && otherParticipant.id === product.seller?.id && !hasReviewed) {
        return <>
            <ActionBanner
                title={`Merci d'avoir sauvé ce produit !`}
                description={`Vous pouvez laisser un avis pour ${otherParticipant.first_name} ${otherParticipant.last_name} !`}
                buttons={[{
                    action: () => setShowReviewDialog(true),
                    text: "Laisser un avis"
                }]}
            />
            {
                showReviewDialog && otherParticipant && (
                    <ReviewDialog
                        isOpen={showReviewDialog}
                        onClose={() => setShowReviewDialog(false)}
                        transactionId={lastTransaction.id}
                        product={product}
                        otherParticipant={otherParticipant}
                        isBuyer={!isSeller}
                    />
                )
            }
        </>
    }
    // Step 7 : Buyer or Seller has left a review
    if (hasBuyer && isCompleted && hasReviewed) {
        return <>
            <ActionBanner
                title={`Merci d'avoir laissé un avis !`}
            />
        </>
    }
}


export default ProductActions;