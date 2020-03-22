import React from "react";
import { AppBar, Toolbar, Typography } from '@material-ui/core';

function TopBar() {
    return (
        <AppBar color="primary" position="static">
            <Toolbar>
                <Typography variant="h6">Cloud IEP</Typography>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;