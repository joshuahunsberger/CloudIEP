import { AppBar, Button, makeStyles, Toolbar, Typography, useTheme } from '@material-ui/core';
import { Cloud } from '@material-ui/icons';
import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    homeLink: {
        textDecoration: 'none',
        color: "inherit"
    },
    gap: {
        flex: 1
    }
}));

function Header() {
    const theme = useTheme();
    const classes = useStyles(theme);
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    return (
        <AppBar position="static">
            <Toolbar >
                <Cloud className={classes.icon} />
                <Link to="/" className={classes.homeLink}>
                    <Typography variant="h6">Cloud IEP</Typography>
                </Link>
                <div className={classes.gap} />
                {!isAuthenticated &&
                    <Button onClick={() => loginWithRedirect({})}>Login</Button>
                }

                {isAuthenticated &&
                    <Button onClick={() => logout()}>Log out</Button>
                }
            </Toolbar>
        </AppBar>
    );
}

export default Header;
