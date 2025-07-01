import ProfileAppBar from '@/components/ProfileAppBar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const SellPageHeader = () => {
    const navigate = useNavigate();

    return (
        <ProfileAppBar>
            <div className='relative flex items-center size-full justify-center'>
                <Button
                    type="button"
                    variant="ghost"
                    className='absolute left-3 p-1'
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className='size-8 text-purple-dark' />
                </Button>
                <h1 className='font-bold text-xl'>Vendre un produit</h1>
            </div>
        </ProfileAppBar>
    );
};

export default SellPageHeader;
