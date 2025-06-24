import { useSellerSetup } from "@/api/Seller";
import { Button } from "@/components/ui/button";
import logo from "@/assets/MealMatesLogo.webp";
import stripeLogo from "@/assets/stripe.svg";

const SellerStatusPage = () => {
    const { data: sellerSetup, error, isLoading } = useSellerSetup();
    if (error) {
        return <div className="h-screen flex items-center justify-center">Erreur lors du chargement des informations de setup</div>;
    }
    return (
        <div className='bg-gray-100 flex flex-col items-center justify-center h-screen pb-20 gap-8'>
            <img
                src={logo}
                alt="MealMates Logo"
                className="w-[90vw] max-w-30 mb-4"
            />
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Vous n'avez pas encore de compte vendeur !</h1>
                <div className="flex flex-wrap justify-center items-center">
                    <span className="text-gray-600 align-text-bottom">Veuillez compléter votre profil sur</span><img src={stripeLogo} className="h-[20px] mx-1.5 pt-0.5" alt="Stripe" /> <span className="text-gray-600 align-text-bottom"> pour commencer à vendre.</span>
                </div>
            </div>
            <Button
                type="button"
                onClick={() => window.location.href = sellerSetup}
                className="bg-purple-dark hover:bg-purple-dark/90"
                disabled={isLoading}
            >
                {isLoading ? "Chargement..." : "Compléter mon profil"}
            </Button>
        </div>
    );
};

export default SellerStatusPage;
