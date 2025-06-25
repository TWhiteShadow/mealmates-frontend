import SellPageHeader from '../components/SellPage/SellPageHeader';
import SellPageForm from '../components/SellPage/SellPageForm';
import { useSellerStatus } from '@/api/Seller';
import SellerStatusPage from './SellerStatusPage';


export default function SellPage() {
    const { data: sellerStatus, isLoading, error } = useSellerStatus();
    if (isLoading) {
        return (<div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark"></div>
        </div>);
    }
    if (error) {
        return <div className="h-screen flex items-center justify-center">Impossible de récuperer le status du compte</div>;
    }
    if (!sellerStatus) {
        return (
            <SellerStatusPage />
        );
    }
    return (
        <div className="h-screen relative bg-gray-100 overflow-x-hidden pb-20">
            <SellPageHeader />
            <SellPageForm />
        </div>
    );
}
