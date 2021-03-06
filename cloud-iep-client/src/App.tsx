import { useAuth0 } from '@auth0/auth0-react';
import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import Body from './ui/Body';
import Header from './ui/Header';
import { SnackbarProvider } from './ui/SnackbarProvider';

const history = createBrowserHistory();

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

function App() {
  const { isLoading } = useAuth0();

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Router history={history}>
          <Grid container direction="column">
            <Grid item>
              <Header />
            </Grid>
            <Grid item>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Body />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
