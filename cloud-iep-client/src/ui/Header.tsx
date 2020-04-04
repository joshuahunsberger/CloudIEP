import { AppBar, makeStyles, Toolbar, Typography, useTheme } from '@material-ui/core';
import { Cloud } from '@material-ui/icons';
import React from "react";
import { Link } from "react-router-dom";

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

    return (
        <AppBar position="static">
            <Toolbar >
                <Cloud className={classes.icon} />
                <Link to="/" className={classes.homeLink}>
                    <Typography variant="h6">Cloud IEP</Typography>
                </Link>
                <div className={classes.gap} />
                <Typography>Login</Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Header;