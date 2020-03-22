import { AppBar, Toolbar, Typography, makeStyles, useTheme } from '@material-ui/core';
import { Cloud } from '@material-ui/icons';
import React from "react";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    appName: {
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
                <Typography variant="h6" className={classes.appName}>Cloud IEP</Typography>
                <Typography>Login</Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Header;