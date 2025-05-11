import { FC } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';


type SaveSearchButtonProps = {
  onSaveSearch: () => void;
};

const SaveSearchButton: FC<SaveSearchButtonProps> = ({
  onSaveSearch,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            onClick={onSaveSearch}
            className={`min-h-10 min-w-10 ml-2 bg-purple-dark text-white rounded-full`}
          >
            <Save className='w-5 h-5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sauvegarder cette recherche</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SaveSearchButton;
