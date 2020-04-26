import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';

interface ConfirmDialogProps {
  title: string;
  content: string;
  confirmButtonText: string;
  declineButtonText: string;
  isOpen: boolean;
  confirm: (isConfirmed: boolean) => void;
  forDelete?: boolean;
}

type ButtonColor = 'primary' | 'secondary';
const ConfirmDialog = ({ ...props }: ConfirmDialogProps) => {
  const getConfirmButtonColor = (): ButtonColor => {
    return props.forDelete && props.forDelete === true
      ? 'secondary'
      : 'primary';
  };
  return (
    <Dialog
      open={props.isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => props.confirm(false)}
          variant="contained"
          color="primary"
        >
          {props.declineButtonText}
        </Button>
        <Button
          onClick={() => props.confirm(true)}
          variant="contained"
          color={getConfirmButtonColor()}
          autoFocus
        >
          {props.confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
