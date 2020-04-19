import {
  Avatar,
  makeStyles,
  Paper,
  Theme,
  Typography,
  useTheme,
} from "@material-ui/core";
import React from "react";
import { useAuth0 } from "../../react-auth0-spa";

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

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" align="center">
        Profile
      </Typography>
      <Avatar
        src={user.picture}
        alt="Profile"
        className={classes.largeAvatar}
      />
      <Typography variant="h4">{user.name}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <code>{JSON.stringify(user, null, 2)}</code>
    </Paper>
  );
};

export const profileRoute = "/profile";
export default Profile;
