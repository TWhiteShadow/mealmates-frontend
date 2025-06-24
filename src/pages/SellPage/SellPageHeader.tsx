import ProfileAppBar from '@/components/ProfileAppBar';
import { Button } from '@/components/ui/button';
import { ArrowBackIosOutlined } from '@mui/icons-material';

const SellPageHeader = () => {
    return (
        <ProfileAppBar>
            <div className='relative flex items-center size-full justify-center'>
                <Button
                    type="button"
                    variant="ghost"
                    className='absolute left-3 p-1'
                    onClick={() => window.history.back()}
                >
                    <ArrowBackIosOutlined fontSize="small" />
                </Button>
                <h1 className='font-bold text-xl'>Vendre un produit</h1>
            </div>
        </ProfileAppBar>
    );
};

export default SellPageHeader;
