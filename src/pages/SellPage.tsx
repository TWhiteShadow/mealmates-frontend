import SellPageHeader from './SellPage/SellPageHeader';
import SellPageForm from './SellPage/SellPageForm';

export default function SellPage() {
    return (
        <div className="h-screen relative bg-gray-100 overflow-x-hidden pb-20">
            <SellPageHeader />
            <SellPageForm />
        </div>
    );
}
