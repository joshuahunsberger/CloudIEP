import React from 'react';
import { useParams } from 'react-router-dom';
import useStudentByUrl from '../../students/useStudentByUrl';
import ApiStatus from '../../types/ApiStatus';
import {
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Theme,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import { Cake, Person } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
}));

const StudentDetail = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { id } = useParams();
  const url = 'http://localhost:5000/api/Student/' + id;
  const service = useStudentByUrl(url);

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
          <Typography variant="h4" align="center">
            TODO: Goals
          </Typography>
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
