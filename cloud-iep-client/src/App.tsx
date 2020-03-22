
import { Box, Typography } from "@material-ui/core";
import React from "react";
import "./App.css";
import TopBar from './ui/TopBar';

function App() {
  return (
    <div className="App">
      <Box>
        <TopBar />
        <Typography variant="h1">Home</Typography>
      </Box>
    </div>
  );
}

export default App;
