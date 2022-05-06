import { Snackbar } from '@mui/material';
import React, { useContext, useState } from 'react';

interface SnackbarContextState {
  isOpen: boolean;
  message: string;
  closeDuration: number;
  openSnackbar: (message: string, closeDuration?: number) => void;
  closeSnackbar: () => void;
}

const SnackbarContext = React.createContext({} as SnackbarContextState);

export const useSnackbar = () => useContext(SnackbarContext);

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [closeDuration, setCloseDuration] = useState(5000);

  const openSnackbar = (message: string, closeDuration?: number) => {
    closeDuration && setCloseDuration(closeDuration);
    setMessage(message);
    setOpen(true);
  };

  const closeSnackbar = () => {
    setCloseDuration(5000);
    setMessage('');
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider
      value={{
        isOpen,
        message,
        closeDuration,
        openSnackbar,
        closeSnackbar,
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isOpen}
        message={message}
        autoHideDuration={closeDuration}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};
