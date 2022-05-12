import { useAuth0 } from '@auth0/auth0-react';
import { Cloud } from '@mui/icons-material';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { studentsRoute } from './student/StudentPage';

const PREFIX = 'Header';

const classes = {
  icon: `${PREFIX}-icon`,
  homeLink: `${PREFIX}-homeLink`,
  gap: `${PREFIX}-gap`,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  [`& .${classes.icon}`]: {
    marginRight: theme.spacing(2),
  },

  [`& .${classes.homeLink}`]: {
    textDecoration: 'none',
    color: 'inherit',
    margin: theme.spacing(0, 2),
  },

  [`& .${classes.gap}`]: {
    flex: 1,
  },
}));

function Header() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <StyledAppBar position="static">
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
          <Button color="inherit" onClick={() => loginWithRedirect({})}>
            Login
          </Button>
        )}

        {isAuthenticated && user && (
          <>
            <Link to="/profile">
              <Avatar src={user.picture} alt="Profile" />
            </Link>
            <Button color="inherit" onClick={() => logout()}>
              Log out
            </Button>
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
}

export default Header;
