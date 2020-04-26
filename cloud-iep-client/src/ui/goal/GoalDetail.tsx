import React from 'react';
import { useParams } from 'react-router-dom';
import useGoalByUrl from '../../goals/useGoalByUrl';
import ApiStatus from '../../types/ApiStatus';
import { CircularProgress, Typography } from '@material-ui/core';

const GoalDetail = () => {
  const { id } = useParams();
  const url = 'http://localhost:5000/api/Goal/' + id;
  const service = useGoalByUrl(url);

  return (
    <>
      {service.status === ApiStatus.Loading && <CircularProgress />}
      {service.status === ApiStatus.Loaded && (
        <Typography>Loaded goal</Typography>
        // TODO: Add data point
        // TODO: Graph data points
      )}
      {service.status === ApiStatus.Error && (
        <Typography variant="h6">
          There was an error retrieving this goal. {service.error.message}
        </Typography>
      )}
    </>
  );
};

export const goalDetailRoute = '/goal/:id';
export default GoalDetail;
