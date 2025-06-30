import { useNavigate } from "react-router";
import { useUserBoughtProducts } from "@/api/Product";
import { Skeleton } from "@/components/ui/skeleton";
import OrderCard from "@/components/OrderCard";
import ProfileAppBar from "@/components/ProfileAppBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const OrdersPage = () => {
    const { data: userBoughtProductsData, isLoading } = useUserBoughtProducts();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pb-20 relative bg-gray-100">
            <ProfileAppBar>
                <div className='relative flex items-center size-full justify-center'>
                    <Button
                        variant="ghost"
                        className='absolute left-3 p-1'
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className='size-8 text-purple-dark' />
                    </Button>
                    <h1 className='font-bold text-xl'>Mes commandes</h1>
                </div>
            </ProfileAppBar>

            <div className="max-w-md mx-auto px-4 mt-6">
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-24 bg-gray-200 w-full rounded-lg" />
                        <Skeleton className="h-24 bg-gray-200 w-full rounded-lg" />
                        <Skeleton className="h-24 bg-gray-200 w-full rounded-lg" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userBoughtProductsData && userBoughtProductsData.length > 0 ? (
                            userBoughtProductsData.map((product) => (
                                <OrderCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => navigate(`/app/product/${product.id}`)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Vous n'avez pas encore passé de commandes.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
