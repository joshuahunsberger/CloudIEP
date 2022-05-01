import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import { ArrowBack, Edit } from '@material-ui/icons';
import { add, startOfDay } from 'date-fns';
import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Goal, Observation } from '../../goals/Goal';
import { sortObservationsByDate } from '../../goals/observationSort';
import useGoalByUrl from '../../goals/useGoalByUrl';
import getBaseUrl from '../../network/getBaseUrl';
import postRequest from '../../network/postRequest';
import putRequest from '../../network/putRequest';
import ApiStatus from '../../types/ApiStatus';
import GoalForm from './GoalForm';
import ObservationForm from './ObservationForm';
import ObservationGraph from './ObservationGraph';
import ObservationTable from './ObservationTable';

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
  const { id } = useParams<{ id: string }>();
  const baseUrl = getBaseUrl();
  const goalUrl = baseUrl + 'goal/' + id;
  const service = useGoalByUrl(goalUrl);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const defaultGoal: Goal = {
    id: '',
    goalName: '',
    goalDescription: '',
    category: '',
    beginDate: startOfDay(new Date()),
    endDate: startOfDay(add(new Date(), { years: 1 })),
    goalPercentage: 0,
    objectives: [],
    observations: [],
    studentId: id!,
  };

  const [goal, setGoal] = useState<Goal>(defaultGoal);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    service.status === ApiStatus.Loaded && setGoal(service.result);
  }, [service]);

  const addObservation = async (newObservation: Observation) => {
    var url = goalUrl + '/observation';
    var token = await getAccessTokenSilently();
    await postRequest<Observation>(url, newObservation, token);
    setIsAdding(false);
    setGoal({
      ...goal,
      observations: [...goal.observations, newObservation].sort(
        sortObservationsByDate,
      ),
    });
  };

  const cancel = () => {
    setIsAdding(false);
  };

  const handleGoalSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    var token = await getAccessTokenSilently();
    await putRequest(goalUrl, goal, token);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <>
      {service.status === ApiStatus.Loading && <CircularProgress />}
      {service.status === ApiStatus.Loaded && (
        <>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Card className={classes.root}>
            <Typography variant="h4" align="center">
              Goal
            </Typography>
            <IconButton>
              <Edit onClick={() => setIsEditing(true)} />
            </IconButton>
            {isEditing ? (
              <GoalForm
                goal={goal}
                setGoal={setGoal}
                handleSubmit={handleGoalSubmit}
                cancel={cancelEditing}
                isEditing={true}
              />
            ) : (
              <List>
                <ListItem>
                  <ListItemText primary="Goal Name" secondary={goal.goalName} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Goal Description"
                    secondary={goal.goalDescription}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Category" secondary={goal.category} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Goal Percentage"
                    secondary={goal.goalPercentage}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Begin Date"
                    secondary={goal.beginDate.toDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="End Date"
                    secondary={goal.endDate.toDateString()}
                  />
                </ListItem>
              </List>
            )}
          </Card>
          {isAdding ? (
            <ObservationForm addObservation={addObservation} cancel={cancel} />
          ) : (
            <>
              <Grid container item direction="column" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsAdding(true)}
                  className={classes.button}
                >
                  Add Observation
                </Button>
                <Typography variant="h4" align="center">
                  Observations
                </Typography>
                <ObservationTable observations={goal.observations} />
              </Grid>
              <ObservationGraph
                observations={goal.observations}
                goalPercentage={goal.goalPercentage}
              />
            </>
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
