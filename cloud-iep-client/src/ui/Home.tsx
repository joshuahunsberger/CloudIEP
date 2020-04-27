import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import { useAuth0 } from '../react-auth0-spa';

function Home() {
  const { isAuthenticated } = useAuth0();
  return (
    <Paper>
      <Typography variant="h4" align="center" gutterBottom>
        Home
      </Typography>
      <Typography variant="body1" align="center">
        {isAuthenticated ? 'Welcome back.' : 'Please log in.'}
      </Typography>
    </Paper>
  );
}

export const homeRoute = '/';
export default Home;
