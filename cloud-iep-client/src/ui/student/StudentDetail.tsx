import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core';
import { ArrowBack, Cake, Edit, Person } from '@material-ui/icons';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { add, startOfDay } from 'date-fns';
import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Goal } from '../../goals/Goal';
import deleteRequest from '../../network/deleteRequest';
import getBaseUrl from '../../network/getBaseUrl';
import postRequest from '../../network/postRequest';
import putRequest from '../../network/putRequest';
import { GoalPreview } from '../../students/GoalPreview';
import { Student } from '../../students/Student';
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
  const { id } = useParams<{ id: string }>();
  const baseUrl = getBaseUrl();
  const url = baseUrl + 'Student/' + id;
  const service = useStudentByUrl(url);
  const snackBar = useSnackbar();
  const navigate = useNavigate();

  const defaultStudent: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: startOfDay(new Date()),
    goals: [],
  };
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
  const [student, setStudent] = useState<Student>(defaultStudent);
  const [goals, setGoals] = useState<GoalPreview[]>([]);
  const [goal, setGoal] = useState<Goal>(defaultGoal);
  const { getAccessTokenSilently } = useAuth0();
  const [editingFirstName, setEditingFirstName] = useState(false);
  const [pendingFirstName, setPendingFirstName] = useState('');
  const [editingLastName, setEditingLastName] = useState(false);
  const [pendingLastName, setPendingLastName] = useState('');
  const [editingDoB, setEditingDoB] = useState(false);
  const [pendingDoB, setPendingDoB] = useState<Date>(new Date());

  useEffect(() => {
    const updateFromService = (studentResponse: Student) => {
      setStudent(studentResponse);
      setGoals(studentResponse.goals);
    };
    service.status === ApiStatus.Loaded && updateFromService(service.result);
  }, [service]);

  const hideAllFields = () => {
    setEditingFirstName(false);
    setEditingLastName(false);
    setEditingDoB(false);
  };

  const handleDateChange = (date: Date | null) => {
    date && setPendingDoB(date);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent,
    fieldName: string,
  ) => {
    const key = event.key;

    switch (key) {
      case 'Escape':
        hideAllFields();
        break;
      case 'Enter':
        if (fieldName === 'firstName') {
          try {
            await updateFirstName(pendingFirstName);
            snackBar.openSnackbar('First name saved.');
          } catch (error) {
            console.log(error);
            snackBar.openSnackbar('Error saving first name');
          }
          hideAllFields();
        } else if (fieldName === 'lastName') {
          try {
            await updateLastName(pendingLastName);
            snackBar.openSnackbar('Last name saved.');
          } catch (error) {
            console.log(error);
            snackBar.openSnackbar('Error saving last name');
          }
          hideAllFields();
        } else if (fieldName === 'dob') {
          try {
            await updateDoB(pendingDoB);
            snackBar.openSnackbar('Date of birth saved.');
          } catch (error) {
            console.log(error);
            snackBar.openSnackbar('Error saving Date of Birth.');
          }
          hideAllFields();
        }
        break;
    }
  };

  const updateFirstName = async (firstName: string) => {
    await updateStudent({ ...student, firstName: firstName });
  };

  const updateLastName = async (lastName: string) => {
    await updateStudent({ ...student, lastName: lastName });
  };

  const updateDoB = async (date: Date) => {
    await updateStudent({ ...student, dateOfBirth: date });
  };

  const updateStudent = async (pendingStudent: Student) => {
    const token = await getAccessTokenSilently();
    await putRequest(url, pendingStudent, token);
    setStudent(pendingStudent);
  };

  const addGoal = async (newGoal: Goal) => {
    const token = await getAccessTokenSilently();
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
    const token = await getAccessTokenSilently();
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
        <>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Paper className={classes.root}>
            <Typography variant="h4" align="center">
              Student Detail
            </Typography>
            <List>
              <ListItem>
                {editingFirstName ? (
                  <TextField
                    autoFocus
                    fullWidth
                    label="First Name"
                    value={pendingFirstName}
                    onChange={(event) =>
                      setPendingFirstName(event.currentTarget.value)
                    }
                    onKeyDown={(event) => handleKeyDown(event, 'firstName')}
                    onBlur={() => setEditingFirstName(false)}
                  />
                ) : (
                  <>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="First Name"
                      secondary={student.firstName}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => {
                          setPendingFirstName(student.firstName);
                          setEditingFirstName(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
              <ListItem>
                {editingLastName ? (
                  <TextField
                    autoFocus
                    fullWidth
                    label="Last Name"
                    value={pendingLastName}
                    onChange={(event) =>
                      setPendingLastName(event.currentTarget.value)
                    }
                    onKeyDown={(event) => handleKeyDown(event, 'lastName')}
                    onBlur={() => setEditingLastName(false)}
                  />
                ) : (
                  <>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Name"
                      secondary={student.lastName}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => {
                          setPendingLastName(student.lastName);
                          setEditingLastName(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
              <ListItem>
                {editingDoB ? (
                  <DatePicker
                    disableFuture
                    inputFormat="MM/dd/yyyy"
                    label="Date of Birth"
                    views={['year', 'month', 'day']}
                    value={pendingDoB}
                    onChange={(date) => handleDateChange(date)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                ) : (
                  <>
                    <ListItemIcon>
                      <Cake />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date of Birth"
                      secondary={service.result.dateOfBirth.toDateString()}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => {
                          setPendingDoB(student.dateOfBirth);
                          setEditingDoB(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
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
        </>
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
