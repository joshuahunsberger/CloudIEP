import {
  Avatar,
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
  TextField,
} from '@material-ui/core';
import { ContactMail, Edit, Person } from '@material-ui/icons';
import React, { useState } from 'react';
import { useAuth0 } from '../../react-auth0-spa';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  largeAvatar: {
    margin: theme.spacing(1),
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

const Profile = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { loading, user } = useAuth0();
  const [editingFirstName, setEditingFirstName] = useState(false);
  const [editingLastName, setEditingLastName] = useState(false);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" align="center">
        Profile
      </Typography>
      <Grid container alignContent="center">
        <Grid item xs={12}>
          <Avatar
            src={user.picture}
            alt="Profile"
            className={classes.largeAvatar}
          />

          <List>
            <ListItem>
              {editingFirstName ? (
                <TextField
                  autoFocus
                  fullWidth
                  label="First Name"
                  onBlur={() => setEditingFirstName(false)}
                />
              ) : (
                <>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>

                  <ListItemText primary="First Name" secondary={user.name} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => setEditingFirstName(true)}>
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
                  onBlur={() => setEditingLastName(false)}
                />
              ) : (
                <>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Last Name" secondary="Placeholder" />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => setEditingLastName(true)}>
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ContactMail />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={user.email} />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

export const profileRoute = '/profile';
export default Profile;
