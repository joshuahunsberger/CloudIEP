import { Card, CardContent, makeStyles, Typography, useTheme } from '@material-ui/core';
import React from 'react';
import postRequest from '../network/postRequest';
import { Student } from '../students/Student';
import StudentForm from './StudentForm';

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
}));

const addStudent = (newStudent: Student) => {
    postRequest<Student>('http://localhost:5000/api/Student', newStudent)
        .then(response => console.log("New ID: " + response.id))
        .catch(error => console.log(error));
}

const StudentPage = () => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h4" align="center">Add a Student</Typography>
                <StudentForm addStudent={addStudent} />
            </CardContent>
        </Card>
    )
}

export default StudentPage;
