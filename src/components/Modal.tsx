import {
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

export interface DialogTitleProps {
  children?: React.ReactNode
  onClose: () => void
}

export function Modal({
  content, title, actions, onClose,
}: { content: JSX.Element, actions: JSX.Element, title: string,
  onClose: () => void }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, [content]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {title}
        {onClose
          ? (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 10,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              <CloseIcon />
            </IconButton>
          )
          : null}
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        {actions}
      </DialogActions>
    </Dialog>
  );
}
