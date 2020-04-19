import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React from "react";

interface ConfirmDialogProps {
  title: string;
  content: string;
  confirmButtonText: string;
  declineButtonText: string;
  isOpen: boolean;
  confirm: (isConfirmed: boolean) => void;
}

const ConfirmDialog = ({ ...props }: ConfirmDialogProps) => {
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
        <Button onClick={() => props.confirm(false)} color="primary">
          {props.declineButtonText}
        </Button>
        <Button onClick={() => props.confirm(true)} color="primary" autoFocus>
          {props.confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
