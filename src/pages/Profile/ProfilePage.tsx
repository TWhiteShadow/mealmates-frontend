import ProfileAppBar from "@/components/ProfileAppBar";
import MealMatesLogo from '../../assets/MealMatesLogo.webp';
import OrderCard from "@/components/OrderCard";
import { BoltRounded, Euro, Settings } from "@mui/icons-material";
import StatCard from "@/components/StatCard";
import { useNavigate } from "react-router";
import { useUserData } from "@/api/User";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfilePage = () => {
    const { isLoading, data: userData } = useUserData();

    const navigate = useNavigate();

    const handleSettings = () => {
        navigate('/app/profile/settings');
    };


    return (
        <div className="h-screen relative bg-gray-100 overflow-hidden">
            <ProfileAppBar>
                <div className="flex items-center gap-3">
                    {!isLoading ? (
                        <>
                            <Avatar className="h-12 w-12">
                                <AvatarImage
                                    src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${userData?.first_name || 'default'}&backgroundColor=5e1969&shapeColor=c19ee0`}
                                    alt="Profile"
                                />
                                <AvatarFallback>User</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-lg">{userData?.first_name + " " + userData?.last_name}</span>
                        </>
                    ) : (
                        <>
                            <Skeleton className="h-12 w-12 rounded-full" /> <Skeleton className="h-4 w-[250px]" />
                        </>
                    )}

                </div>
                <button onClick={handleSettings}>
                    <Settings sx={{ fontSize: 28 }} className='!text-purple-dark' />
                </button>
            </ProfileAppBar>
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
                        <a href="#" className="text-purple-dark underline-offset-2 underline text-sm">Voir plus</a>
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
                        className="text-purple-dark"
                        icon={<BoltRounded sx={{ fontSize: 80 }} />}
                    />
                    <StatCard
                        title="Argent économisé"
                        value="32"
                        unit="EUR"
                        className="text-purple-dark"
                        icon={<Euro sx={{ fontSize: 80 }} />}
                    />
                </div>

                <p className="text-center text-gray-500 text-sm mt-8">
                    MealMates 0.0.1
                </p>
            </div>
        </div>
    );
};

export default ProfilePage;
