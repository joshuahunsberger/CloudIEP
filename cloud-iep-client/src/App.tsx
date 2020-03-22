import { createMuiTheme, Grid, ThemeProvider } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import React from "react";
import Body from "./ui/Body";
import Header from "./ui/Header";

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
          <Body />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
