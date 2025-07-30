import { useAuth0 } from '@auth0/auth0-react';
import { ContactMail, Edit, Person } from '@mui/icons-material';
import {
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import postRequest from '../../network/postRequest';
import ApiStatus from '../../types/ApiStatus';
import useUsersApi from '../../users/useUserApi';
import { useSnackbar } from '../SnackbarHooks';

const PREFIX = 'Profile';

const classes = {
  root: `${PREFIX}-root`,
  largeAvatar: `${PREFIX}-largeAvatar`,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  [`&.${classes.root}`]: {
    marginTop: theme.spacing(4),
  },

  [`& .${classes.largeAvatar}`]: {
    margin: theme.spacing(1),
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

const Profile = () => {
  const snackbar = useSnackbar();

  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const [editingFirstName, setEditingFirstName] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [pendingFirstName, setPendingFirstName] = useState('');
  const [editingLastName, setEditingLastName] = useState(false);
  const [lastName, setLastName] = useState('');
  const [pendingLastName, setPendingLastName] = useState('');

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
            setFirstName(pendingFirstName);
            snackbar.openSnackbar('First name saved.');
          } catch (error) {
            console.log(error);
            snackbar.openSnackbar('Error saving first name');
          }
          hideAllFields();
        } else if (fieldName === 'lastName') {
          try {
            await updateLastName(pendingLastName);
            setLastName(pendingLastName);
            snackbar.openSnackbar('Last name saved.');
          } catch (error) {
            console.log(error);
            snackbar.openSnackbar('Error saving last name');
          }

          hideAllFields();
        }
        break;
    }
  };

  const updateFirstName = async (newFirstName: string) => {
    const token = await getAccessTokenSilently();
    await postRequest(
      'http://localhost:5000/api/User/FirstName',
      newFirstName,
      token,
    );
  };

  const updateLastName = async (newLastName: string) => {
    const token = await getAccessTokenSilently();
    await postRequest(
      'http://localhost:5000/api/User/LastName',
      newLastName,
      token,
    );
  };

  if (isLoading || service.status === ApiStatus.Loading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledPaper className={classes.root}>
      <Typography variant="h2" align="center">
        Profile
      </Typography>
      <Grid container alignContent="center">
        <Grid item xs={12}>
          <Avatar
            src={user!.picture}
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

                    <ListItemText primary="First Name" secondary={firstName} />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => {
                          setPendingFirstName(firstName);
                          setEditingFirstName(true);
                        }}
                        size="large"
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
                    <ListItemText primary="Last Name" secondary={lastName} />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => {
                          setPendingLastName(lastName);
                          setEditingLastName(true);
                        }}
                        size="large"
                      >
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
                <ListItemText primary="Email" secondary={user!.email} />
              </ListItem>
            </List>
          )}
          {service.status === ApiStatus.Error && (
            <Typography>{service.error.message}</Typography>
          )}
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export const profileRoute = '/profile';
export default Profile;
