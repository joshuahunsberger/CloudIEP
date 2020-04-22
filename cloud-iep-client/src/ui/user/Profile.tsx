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
  TextField,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core';
import { ContactMail, Edit, Person } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import postRequest from '../../network/postRequest';
import { useAuth0 } from '../../react-auth0-spa';
import ApiStatus from '../../types/ApiStatus';
import useUsersApi from '../../users/useUserApi';

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
  const { loading, user, getTokenSilently } = useAuth0();
  const [editingFirstName, setEditingFirstName] = useState(false);
  const [firstName, setFirstName] = useState<string>('');
  const [editingLastName, setEditingLastName] = useState(false);
  const [lastName, setLastName] = useState('');

  const service = useUsersApi();

  useEffect(() => {
    if (service.status !== ApiStatus.Loaded) return;
    setFirstName(service.result.firstName);
    setLastName(service.result.lastName);
  }, [service]);

  const hideAllFields = () => {
    setEditingFirstName(false);
    setEditingLastName(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, fieldName: string) => {
    const key = event.key;

    switch (key) {
      case 'Escape':
        hideAllFields();
        break;
      case 'Enter':
        if (fieldName === 'firstName') {
          updateFirstName(firstName);
          hideAllFields();
        } else if (fieldName === 'lastName') {
          updateLastName(lastName);
          hideAllFields();
        }
        break;
    }
  };

  const updateFirstName = async (newFirstName: string) => {
    var token = await getTokenSilently();
    await postRequest(
      'http://localhost:5000/api/User/FirstName',
      newFirstName,
      token,
    );
  };

  const updateLastName = async (newLastName: string) => {
    var token = await getTokenSilently();
    await postRequest(
      'http://localhost:5000/api/User/LastName',
      newLastName,
      token,
    );
  };

  if (loading || service.status === ApiStatus.Loading) {
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

          {service.status === ApiStatus.Loaded && (
            <List>
              <ListItem>
                {editingFirstName ? (
                  <TextField
                    autoFocus
                    fullWidth
                    label="First Name"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.currentTarget.value)
                    }
                    onKeyDown={(event) => handleKeyDown(event, 'firstName')}
                    onBlur={() => setEditingFirstName(false)}
                  />
                ) : (
                  <>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>

                    <ListItemText primary="First Name" secondary={firstName} />
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
                    value={lastName}
                    onChange={(event) => setLastName(event.currentTarget.value)}
                    onKeyDown={(event) => handleKeyDown(event, 'lastName')}
                    onBlur={() => setEditingLastName(false)}
                  />
                ) : (
                  <>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary="Last Name" secondary={lastName} />
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
          )}
          {service.status === ApiStatus.Error && (
            <Typography>{service.error.message}</Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export const profileRoute = '/profile';
export default Profile;
