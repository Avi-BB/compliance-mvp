import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CommonDialogProps } from '@/lib/types/common';

export default function CommonDialog({
  open,
  onClose,
  Component,
  ActionComponent,
  title,
  description,
  dialogWidth='sm',
  isFullWidth=false
}: CommonDialogProps) {
  return (
    <>
      <Dialog
        fullWidth={isFullWidth}
        maxWidth={dialogWidth}
        open={open}
        onClose={onClose}
        sx={{p:2}}
      >
        <DialogTitle sx={{ textAlign: 'center', mb: 0, pb: 0 }}>
          {title}
        </DialogTitle>
        <DialogContent sx={{ mt: -2, }}>

         {Component &&
         <>
         <br />
        {Component}
         </>
         }
          <DialogContentText sx={{ textAlign: 'center', mt: 3 }}>
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ textAlign: 'center',}}>
         {ActionComponent && ActionComponent}
        </DialogActions>
      </Dialog>
    </>
  );
}
