import { useAuth0 } from '@auth0/auth0-react';
import { Paper, Typography } from '@material-ui/core';
import React from 'react';

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
