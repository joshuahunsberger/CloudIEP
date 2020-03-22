import { Paper, Typography } from "@material-ui/core";
import React from 'react';

function Home() {
    return (
        <Paper>
            <Typography variant="h2" align="center" gutterBottom>Home</Typography>
            <Typography variant="body1">This is the homepage content.</Typography>
        </Paper>
    )
}

export default Home;
