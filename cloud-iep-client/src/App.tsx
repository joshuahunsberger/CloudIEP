import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme, Grid, ThemeProvider } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import { Router } from 'react-router-dom';
import { useAuth0 } from "./react-auth0-spa";
import Body from "./ui/Body";
import Header from "./ui/Header";
import history from "./utils/history";

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

function App() {
  const { loading } = useAuth0();

  return loading
    ?
    <div>Loading...</div>
    :
    (
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    );
}

export default App;
