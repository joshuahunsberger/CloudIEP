import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress, Grid } from '@mui/material';
import React from 'react';
import RouterRoutes from '../routing/Routes';
import ErrorBoundary from './ErrorBoundary';

function Body() {
  const { isLoading } = useAuth0();

  return (
    <Grid container>
      <Grid item xs={false} sm={2} />
      <Grid item xs={12} sm={8}>
        <ErrorBoundary logError={console.log}>
          {isLoading ? <CircularProgress /> : <RouterRoutes />}
        </ErrorBoundary>
      </Grid>
      <Grid item xs={false} sm={2} />
    </Grid>
  );
}

export default Body;
