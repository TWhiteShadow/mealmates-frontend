import Navbar from "@/components/ui/Navbar";
import ProfileAppBar from "@/components/ProfileAppBar";
import MealMatesLogo from '../../assets/MealMatesLogo.png';
import OrderCard from "@/components/OrderCard";
import { BoltRounded, Euro } from "@mui/icons-material";
import StatCard from "@/components/StatCard";

const ProfilePage = () => {
    return (
        <div className="h-screen relative bg-gray-100 overflow-hidden">
            <ProfileAppBar />
            <div className="max-w-md mx-auto px-4 pb-20">
                <div className="max-w-xl m-auto">
                    <img
                    src={MealMatesLogo}
                    alt="logo"
                    className="my-7 w-16 ml-auto mr-auto"
                    />
                </div>
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Vos dernières commandes</h2>
                        <a href="#" className="text-purple-700 text-sm">Voir plus</a>
                    </div>
                    
                    <OrderCard
                        image="https://images.unsplash.com/photo-1553909489-cd47e0907980?ixlib=rb-1.2.1&auto=format&fit=crop&w=1025&q=80"
                        title="Sandwich"
                        rating={4.1}
                    />
                </section>

                <div className="grid grid-cols-2 gap-4">
                    <StatCard
                        title="CO2 évité"
                        value="51"
                        unit="KW/h"
                        icon={<BoltRounded sx={{ fontSize: 80, color: '#6D28D9' }} />}
                    />
                    <StatCard
                        title="Argent économisé"
                        value="32"
                        unit="EUR"
                        icon={<Euro sx={{ fontSize: 80, color: '#6D28D9' }} />}
                    />
                </div>

                <p className="text-center text-gray-500 text-sm mt-8">
                MealMates 0.0.1
                </p>
            </div>
            <Navbar />
        </div>
    );
};

export default ProfilePage;
