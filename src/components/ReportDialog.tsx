import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type ReportOption = {
  value: string;
  label: string;
};

type ReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  options: ReportOption[];
  onReport: (reason: string) => void;
  isPending: boolean;
};

const ReportDialog = ({
  open,
  onOpenChange,
  title,
  description,
  options,
  onReport,
  isPending,
}: ReportDialogProps) => {
  const [reportReason, setReportReason] = useState('');

  const handleReport = () => {
    onReport(reportReason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Raison du signalement :</Label>
            <div className='space-y-2'>
              {options.map((option) => (
                <label
                  key={option.value}
                  className='flex items-center space-x-2 cursor-pointer'
                >
                  <input
                    type='radio'
                    name='reportReason'
                    value={option.value}
                    checked={reportReason === option.value}
                    onChange={(e) => setReportReason(e.target.value)}
                    className='w-4 h-4 text-purple-600'
                  />
                  <span className='text-sm'>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleReport} disabled={isPending || !reportReason}>
            {isPending ? 'Envoi...' : 'Signaler'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
