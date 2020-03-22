import { Grid } from "@material-ui/core";
import React from 'react';
import Home from './Home';

function Body() {
    return (
        <Grid container>
            <Grid item xs={false} sm={2} />
            <Grid item xs={12} sm={8} >
                <Home />
            </Grid>
            <Grid item xs={false} sm={2} />
        </Grid>
    )
}

export default Body;
