import { Grid } from "@material-ui/core";
import React from "react";
import Routes from "../routing/Routes";
import ErrorBoundary from "./ErrorBoundary";

function Body() {
  return (
    <Grid container>
      <Grid item xs={false} sm={2} />
      <Grid item xs={12} sm={8}>
        <ErrorBoundary logError={console.log}>
          <Routes />
        </ErrorBoundary>
      </Grid>
      <Grid item xs={false} sm={2} />
    </Grid>
  );
}

export default Body;
