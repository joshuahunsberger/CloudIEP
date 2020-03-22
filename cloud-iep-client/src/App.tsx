
import { createMuiTheme, Grid, ThemeProvider, Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import React from "react";
import Header from './ui/Header';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="column">
        <Grid item>
          <Header />
        </Grid>
        <Grid item>
          <Typography variant="h1">Home</Typography>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
