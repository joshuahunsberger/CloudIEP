import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Cake, Person } from '@material-ui/icons';
import { add, startOfDay } from 'date-fns';
import React, { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Goal } from '../../goals/Goal';
import deleteRequest from '../../network/deleteRequest';
import postRequest from '../../network/postRequest';
import { useAuth0 } from '../../react-auth0-spa';
import { GoalPreview } from '../../students/GoalPreview';
import useStudentByUrl from '../../students/useStudentByUrl';
import ApiStatus from '../../types/ApiStatus';
import GoalForm from '../goal/GoalForm';
import GoalTable from '../goal/GoalTable';
import { useSnackbar } from '../SnackbarProvider';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(2),
  },
}));

const StudentDetail = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { id } = useParams();
  const url = 'http://localhost:5000/api/Student/' + id;
  const service = useStudentByUrl(url);
  const snackBar = useSnackbar();

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

  const [isAdding, setIsAdding] = useState(false);
  const [goals, setGoals] = useState<GoalPreview[]>([]);
  const [goal, setGoal] = useState<Goal>(defaultGoal);
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    service.status === ApiStatus.Loaded && setGoals(service.result.goals);
  }, [service]);

  const addGoal = async (newGoal: Goal) => {
    const token = await getTokenSilently();
    const result = await postRequest<Goal>(
      'http://localhost:5000/api/Goal',
      newGoal,
      token,
    );
    if (result != null) {
      const goalPreview: GoalPreview = {
        goalId: result.id,
        goalName: result.goalName,
      };
      setGoals([...goals, goalPreview]);
      snackBar.openSnackbar('Goal added.');
    }
  };

  const deleteGoal = async (goalId: string) => {
    const token = await getTokenSilently();
    await deleteRequest('http://localhost:5000/api/Goal/' + goalId, token);

    const updatedGoals = goals.filter((goal) => goal.goalId !== goalId);
    setGoals(updatedGoals);
    snackBar.openSnackbar('Goal deleted.');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addGoal(goal);
    setIsAdding(false);
  };

  const cancel = () => {
    setGoal(defaultGoal);
    setIsAdding(false);
  };

  return (
    <>
      {service.status === ApiStatus.Loading && <CircularProgress />}
      {service.status === ApiStatus.Loaded && (
        <Paper className={classes.root}>
          <Typography variant="h2" align="center">
            Student Detail
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText
                primary="First Name"
                secondary={service.result.firstName}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText
                primary="Last Name"
                secondary={service.result.lastName}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Cake />
              </ListItemIcon>
              <ListItemText
                primary="Date of Birth"
                secondary={service.result.dateOfBirth.toDateString()}
              />
            </ListItem>
          </List>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            {isAdding ? (
              <Card>
                <CardContent>
                  <Typography variant="h4" align="center">
                    Add a Goal
                  </Typography>
                  <GoalForm
                    goal={goal}
                    setGoal={setGoal}
                    handleSubmit={handleSubmit}
                    cancel={cancel}
                  />
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsAdding(true)}
                className={classes.button}
              >
                Add Goal
              </Button>
            )}

            <Typography variant="h4" align="center">
              Goals
            </Typography>
            {goals.length > 0 ? (
              <GoalTable goals={goals} deleteGoal={deleteGoal} />
            ) : (
              <Typography variant="h6" align="center">
                You don't have any goals right now. Add one above.
              </Typography>
            )}
          </Grid>
        </Paper>
      )}
      {service.status === ApiStatus.Error && (
        <Typography variant="h6">
          There was an error retrieving this student. {service.error.message}
        </Typography>
      )}
    </>
  );
};

export const studentDetailRoute = '/student/:id';
export default StudentDetail;
