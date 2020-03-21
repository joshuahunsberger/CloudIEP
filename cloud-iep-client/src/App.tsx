
import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Cloud IEP</Typography>
          </Toolbar>
        </AppBar>
        <Typography variant="h1">Home</Typography>
      </Box>
    </div>
  );
}

export default App;
