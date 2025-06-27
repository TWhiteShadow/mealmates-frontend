import { Product, Transaction } from "@/api/Product";
import { Button } from "../ui/button";
import { useUserData } from "@/api/User";
import { useCancelReservationMutation, useConfirmReservationMutation, useGeneratedQRCodeToken, useReserveProductMutation, useTransactionPaymentLink, validateQRCode } from "@/api/Paiement";
import { User } from "@/api/Message";
import { useLocation } from "react-router";
import CustomQRCode from "@/components/CustomQRCode";
import QRCodeScanner from "@/components/QRCodeScanner";

interface OfferActionsProps {
    offer: Product;
    transactions: Transaction[];
    otherParticipant?: User;
    selectedId?: number;
}

const OfferActions = ({ offer, transactions, otherParticipant, selectedId }: OfferActionsProps) => {
    const userData = useUserData();
    const isSeller = userData?.data?.id === offer.seller.id;
    const hasBuyer = offer.buyer !== null;

    const location = useLocation();
    const redirectURI = location.pathname + (selectedId ? `?conversation=${selectedId}` : '');

    const lastTransaction = transactions[transactions.length - 1];
    const isReserved = lastTransaction?.status === 'reserved';
    const isConfirmed = lastTransaction?.status === 'confirmed';
    const isPending = lastTransaction?.status === 'pending';
    const isCompleted = lastTransaction?.status === 'completed';

    const reserveProductMutation = useReserveProductMutation();
    const confirmReservationMutation = useConfirmReservationMutation();
    const cancelReservationMutation = useCancelReservationMutation();


    if (!isSeller && !hasBuyer) {

        return (
            <div className="flex gap-2 h-16 items-center justify-center bg-white border-t border-gray-200">
                <Button
                    size={"lg"}
                    className="bg-purple-dark hover:bg-purple-dark/90 text-white"
                    onClick={() => { reserveProductMutation.mutate(offer.id) }}
                >Réserver</Button>
            </div>
        );
    }
    if (!isSeller && hasBuyer && isReserved && otherParticipant && otherParticipant.id === offer.seller?.id) {
        return (
            <div className="flex gap-2 h-16 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    <p className="text-gray-600">Vous avez réservé ce produit ! </p>
                    <p className="text-gray-600">{otherParticipant.first_name} {otherParticipant.last_name} à maintenant 72 heures pour accepter. </p>
                </div>
                <Button
                    size={"lg"}
                    variant={"outline"}
                    onClick={() => { cancelReservationMutation.mutate(lastTransaction.id) }}
                >Annuler</Button>
            </div>
        );
    }

    if (isSeller && hasBuyer && isReserved && otherParticipant && otherParticipant.id === offer.buyer?.id) {
        return (
            <div className="flex gap-2 h-16 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    <p className="text-gray-600">{otherParticipant.first_name} {otherParticipant.last_name} souhaite réserver ce produit.</p>
                </div>
                <Button
                    size={"lg"}
                    className="bg-purple-dark hover:bg-purple-dark/90 text-white"
                    onClick={() => { confirmReservationMutation.mutate(lastTransaction.id) }}
                >Confirmer la réservation</Button>
            </div>
        );
    }
    if (isSeller && hasBuyer && isConfirmed && otherParticipant && otherParticipant.id === offer.buyer?.id) {
        return (
            <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    <p className="text-gray-600">Vous avez confirmé la réservation de {otherParticipant.first_name} {otherParticipant.last_name}</p>
                    <p className="text-gray-600">{otherParticipant.first_name} {otherParticipant.last_name} à maintenant 72 heures pour payer. </p>
                </div>
                <Button
                    size={"lg"}
                    variant={"outline"}
                    onClick={() => { cancelReservationMutation.mutate(lastTransaction.id) }}
                >Annuler</Button>
            </div>
        );
    }

    if (!isSeller && hasBuyer && isConfirmed && otherParticipant && otherParticipant.id === offer.seller.id) {
        const { data: paymentLink, isLoading } = useTransactionPaymentLink(lastTransaction.id, redirectURI);
        return (
            <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    <p className="text-gray-600"> {offer.seller.first_name} {offer.seller.last_name} à confirmé votre réservation !</p>
                    <p className="text-gray-600">Vous pouvez maintenant pré-payer le produit.</p>
                </div>
                <Button
                    size={"lg"}
                    disabled={isLoading || !paymentLink}
                    onClick={() => window.location.href = paymentLink || ''}
                >Acheter</Button>
            </div>
        );
    }

    if (!isSeller && hasBuyer && isPending && otherParticipant && otherParticipant.id === offer.seller.id) {
        const { data: qrCodeUrl } = useGeneratedQRCodeToken(lastTransaction?.id || 0);
        return (
            <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    <p className="text-gray-600">Bravo ! Vous avez réservé ce produit !</p>
                    <p className="text-gray-600">Au moment de votre rencontre, le vendeur devra scanner le QR code ci-dessous.</p>
                </div>
                {qrCodeUrl && <CustomQRCode value={qrCodeUrl} size={150} />}
            </div>
        );
    }

    if (isSeller && hasBuyer && isPending && otherParticipant && otherParticipant.id === offer.buyer?.id) {
        const handleScan = (value: string) => {
            if (value.startsWith(import.meta.env.VITE_BACKEND_URL)) {
                validateQRCode(value);
            }
        }
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
    if (!isSeller && hasBuyer && isCompleted && otherParticipant && otherParticipant.id === offer.seller?.id) {
        return (
            <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    <p className="text-gray-600">Bravo ! Vous avez acheté "{offer.name}" pour {lastTransaction.amount}€</p>
                    <p className="text-gray-600">Vous pouvez laisser un avis sur le vendeur !</p>
                </div>
                <Button
                    size={"lg"}
                    className="bg-purple-dark hover:bg-purple-dark/90 text-white"
                    onClick={() => { }}
                >Laisser un avis</Button>
            </div>
        );
    }
    if (isSeller && hasBuyer && isCompleted && otherParticipant && otherParticipant.id === offer.buyer?.id) {
        return (
            <div className="flex gap-5 flex-wrap min-h-16 p-4 items-center justify-center bg-white border-t border-gray-200">
                <div className="textBox text-center">
                    <p className="text-gray-600">Merci d'avoir vendu votre produit !</p>
                    <p className="text-gray-600">Vous pouvez laisser un avis sur l'acheteur !</p>
                </div>
                <Button
                    size={"lg"}
                    className="bg-purple-dark hover:bg-purple-dark/90 text-white"
                    onClick={() => { }}
                >Laisser un avis</Button>
            </div>
        );
    }

}


export default OfferActions;