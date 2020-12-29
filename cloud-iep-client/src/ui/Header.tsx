import {
  AppBar,
  Avatar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Cloud } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { studentsRoute } from './student/StudentPage';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  homeLink: {
    textDecoration: 'none',
    color: 'inherit',
    margin: theme.spacing(0, 2),
  },
  gap: {
    flex: 1,
  },
}));

function Header() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <AppBar position="static">
      <Toolbar>
        <Cloud className={classes.icon} />
        <Link to="/" className={classes.homeLink}>
          <Typography variant="h6">Cloud IEP</Typography>
        </Link>
        <Typography variant="h6">|</Typography>
        <Link to={studentsRoute} className={classes.homeLink}>
          <Typography variant="h6">Students</Typography>
        </Link>
        <div className={classes.gap} />
        {!isAuthenticated && (
          <Button onClick={() => loginWithRedirect({})}>Login</Button>
        )}

        {isAuthenticated && (
          <>
            <Link to="/profile">
              <Avatar src={user.picture} alt="Profile" />
            </Link>
            <Button onClick={() => logout()}>Log out</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
