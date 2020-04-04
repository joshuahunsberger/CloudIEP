import { Card, CardContent, CircularProgress, Grid, makeStyles, Typography, useTheme } from '@material-ui/core';
import React from 'react';
import postRequest from '../network/postRequest';
import { Student } from '../students/Student';
import useStudentsApi from "../students/useStudentsApi";
import ApiStatus from "../types/ApiStatus";
import StudentForm from './StudentForm';
import StudentTable from './StudentTable';

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    dataCard: {
        marginTop: theme.spacing(4)
    },
    noStudents: {
        align: 'center'
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
    const service = useStudentsApi();

    return (
        <>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h4" align="center">Add a Student</Typography>
                    <StudentForm addStudent={addStudent} />
                </CardContent>
            </Card>
            <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                className={classes.dataCard}
            >
                {service.status === ApiStatus.Loading && <CircularProgress />}
                {service.status === ApiStatus.Loaded &&
                    (service.result.length > 0
                        ?
                        <StudentTable students={service.result} />
                        :
                        <Typography variant="h4">No Students</Typography>
                    )
                }
                {service.status === ApiStatus.Error && (
                    <div>There was an error getting students.</div>
                )}
            </Grid>
        </>
    )
}

export default StudentPage;
