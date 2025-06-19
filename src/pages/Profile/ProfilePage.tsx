import ProfileAppBar from "@/components/ProfileAppBar";
import MealMatesLogo from '../../assets/MealMatesLogo.webp';
import OrderCard from "@/components/OrderCard";
import { BoltRounded, Euro, Settings } from "@mui/icons-material";
import StatCard from "@/components/StatCard";
import { useNavigate } from "react-router";
import { useUserData } from "@/api/User";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAllUserProducts, useUserBoughtProducts } from "@/api/Product";

const ProfilePage = () => {
    const { isLoading: isLoadingUserData, data: userData } = useUserData();

    const { isLoading: isLoadingUserProductsData, data: userProductsData } = useAllUserProducts();

    const { isLoading: isLoadingUserBoughtProductsData, data: userBoughtProductsData } = useUserBoughtProducts();

    const navigate = useNavigate();

    const handleSettings = () => {
        navigate('/app/profile/settings');
    };


    return (
        <div className="h-[calc(100vh+56px)] relative bg-gray-100">
            <ProfileAppBar>
                <div className="flex items-center gap-3">
                    {!isLoadingUserData ? (
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
                    {isLoadingUserBoughtProductsData ? (
                        <div className="space-y-4">
                            <Skeleton className="h-24 bg-red-200 w-full rounded-lg" />
                            <Skeleton className="h-24 bg-gray-200 w-full rounded-lg" />
                            <Skeleton className="h-24 bg-green-200 w-full rounded-lg" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userBoughtProductsData && userBoughtProductsData.length > 0 ? (
                                userBoughtProductsData.slice(0, 3).map((product) => (
                                    <OrderCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500">Vous n'avez pas encore passé de commandes.</p>
                            )}
                        </div>
                    )}
                </section>

                <section className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Vos offres</h2>
                        <a href="#" className="text-purple-dark underline-offset-2 underline text-sm">Voir plus</a>
                    </div>

                    {isLoadingUserProductsData ? (
                        <div className="space-y-4">
                            <Skeleton className="h-24 bg-gray-200 w-full rounded-lg" />
                            <Skeleton className="h-24 bg-gray-200 w-full rounded-lg" />
                            <Skeleton className="h-24 bg-gray-200 w-full rounded-lg" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userProductsData && userProductsData.length > 0 ? (
                                userProductsData.slice(0, 3).map((product) => (
                                    <OrderCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500">Vous n'avez pas d'offres publiées.</p>
                            )}
                        </div>
                    )}
                </section>


                <div className="grid grid-cols-2 gap-4 mt-8">
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
            </div>
        </div>
    );
};

export default ProfilePage;
