import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { createTheme, Grid, StyledEngineProvider } from '@mui/material';
import { blue } from '@mui/material/colors';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Body from './ui/Body';
import Header from './ui/Header';
import { SnackbarProvider } from './ui/SnackbarProvider';

const theme = createTheme({
  palette: {
    primary: blue,
  },
});

function App() {
  // Example from documentation:
  // https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#1-protecting-a-route-in-a-react-router-dom-app
  // Suggested changes: https://github.com/auth0/auth0-react/issues/332#issuecomment-1044483033
  const navigate = useNavigate();
  const onRedirectCallback = (appState?: AppState) => {
    // Use the router's history module to replace the url
    // Replaced with React Router navigate in v6
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN ?? ''}
      clientId={process.env.REACT_APP_AUTH0_CLIENTID ?? ''}
      redirectUri="http://localhost:3000/logincallback"
      scope="openid"
      audience="https://cloudiepdev/api"
      onRedirectCallback={onRedirectCallback}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <Grid container direction="column">
              <Grid item>
                <Header />
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Body />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Auth0Provider>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
