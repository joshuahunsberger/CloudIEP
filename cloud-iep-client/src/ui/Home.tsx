import { Paper, Typography } from "@material-ui/core";
import React from 'react';
import { Link } from "react-router-dom";

function Home() {
    return (
        <Paper>
            <Typography variant="h2" align="center" gutterBottom>Home</Typography>
            <Typography variant="body1">This is the homepage content.</Typography>
            <Link to="/students">Students</Link>
        </Paper>
    )
}

export default Home;
