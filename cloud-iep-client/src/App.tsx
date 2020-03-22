
import { Box, createMuiTheme, ThemeProvider, Typography } from "@material-ui/core";
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
      <Box>
        <Header />
        <Typography variant="h1">Home</Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
