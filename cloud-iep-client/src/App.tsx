
import { Box, createMuiTheme, ThemeProvider, Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import React from "react";
import TopBar from './ui/TopBar';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <TopBar />
        <Typography variant="h1">Home</Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
