import React, { useState } from 'react';
import { Save } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Tooltip } from '@mui/material';

type SaveSearchButtonProps = {
  onSaveSearch: (name: string) => void;
}

const SaveSearchButton: React.FC<SaveSearchButtonProps> = ({
  onSaveSearch
}) => {
  const [open, setOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
    setSearchName('');
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!searchName.trim()) {
      setError('Veuillez donner un nom à votre recherche');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      onSaveSearch(searchName);
      handleClose();
    } catch (err) {
      console.error('Error saving search:', err);
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsSaving(false);
      handleClose();
    }
  };

  return (
    <>
      <Tooltip title="Sauvegarder cette recherche">
        <IconButton 
          onClick={handleClickOpen}
          className={`min-h-10 min-w-10 ml-2 text-purple-dark border border-gray-400 bg-white rounded-xl hover:bg-gray-100 focus:outline-none`}
        >
          <Save sx={{ width: '20px', height: '20px' }} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Sauvegarder cette recherche</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nom de la recherche"
            type="text"
            fullWidth
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            color="primary"
            disabled={isSaving}
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SaveSearchButton;