"use client"

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material"

interface ConfirmationDialogProps {
  open: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
}

export function ConfirmationDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
