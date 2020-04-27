import {
  Button,
  Card,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Observation } from '../../goals/Goal';
import useGoalByUrl from '../../goals/useGoalByUrl';
import getBaseUrl from '../../network/getBaseUrl';
import postRequest from '../../network/postRequest';
import { useAuth0 } from '../../react-auth0-spa';
import ApiStatus from '../../types/ApiStatus';
import ObservationForm from './ObservationForm';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(2),
  },
}));

const GoalDetail = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { id } = useParams();
  const baseUrl = getBaseUrl();
  const goalUrl = baseUrl + 'goal/' + id;
  const service = useGoalByUrl(goalUrl);
  const { getTokenSilently } = useAuth0();
  const [isAdding, setIsAdding] = useState(false);

  const addObservation = async (newObservation: Observation) => {
    var url = goalUrl + '/observation';
    var token = await getTokenSilently();
    await postRequest<Observation>(url, newObservation, token);
  };

  const cancel = () => {
    setIsAdding(false);
  };

  return (
    <>
      {service.status === ApiStatus.Loading && <CircularProgress />}
      {service.status === ApiStatus.Loaded && (
        <>
          <Card className={classes.root}>
            <Typography variant="h4" align="center">
              Goal
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Goal Name"
                  secondary={service.result.goalName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Goal Description"
                  secondary={service.result.goalDescription}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Category"
                  secondary={service.result.category}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Begin Date"
                  secondary={service.result.beginDate.toDateString()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="End Date"
                  secondary={service.result.endDate.toDateString()}
                />
              </ListItem>
            </List>
          </Card>
          {isAdding ? (
            <ObservationForm addObservation={addObservation} cancel={cancel} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsAdding(true)}
              className={classes.button}
            >
              Add Observation
            </Button>
            // TODO: List observations
            // TODO: Graph data points
          )}
        </>
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
