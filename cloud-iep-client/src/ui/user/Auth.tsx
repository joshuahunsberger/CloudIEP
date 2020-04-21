import { CircularProgress, Typography } from '@material-ui/core';
import React from 'react';
import { Redirect } from 'react-router-dom';
import ApiStatus from '../../types/ApiStatus';
import useUsersApi from '../../users/useUserApi';
import { homeRoute } from '../Home';

const Auth = () => {
  const service = useUsersApi();

  return (
    <>
      {service.status === ApiStatus.Loading && <CircularProgress />}
      {service.status === ApiStatus.Loaded && <Redirect to={homeRoute} />}
      {service.status === ApiStatus.Error && (
        <Typography variant="h6">
          There was an error creating your user profile. {service.error.message}
        </Typography>
      )}
    </>
  );
};

export const authCallbackRoute = '/logincallback';
export default Auth;
