import { Card, CardContent, CircularProgress, Grid, makeStyles, Typography, useTheme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import postRequest from '../../network/postRequest';
import { useAuth0 } from "../../react-auth0-spa";
import { Student } from '../../students/Student';
import useStudentsApi from "../../students/useStudentsApi";
import ApiStatus from "../../types/ApiStatus";
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

const StudentPage = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const service = useStudentsApi();
    const [students, setStudents] = useState<Student[]>([]);
    const { getTokenSilently } = useAuth0();

    useEffect(() => {
        service.status === ApiStatus.Loaded &&
            setStudents(service.result);
    }, [service]);

    const addStudent = async (newStudent: Student) => {
        const token = await getTokenSilently();
        const result = await postRequest<Student>('http://localhost:5000/api/Student', newStudent, token);

        if (result != null) {
            setStudents([...students, result]);
        }
        return result;
    }

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
                        <StudentTable students={students} />
                        :
                        <Typography variant="h4">No Students</Typography>
                    )
                }
                {service.status === ApiStatus.Error && (
                    <Typography variant="h6">There was an error getting students. {service.error.message}</Typography>
                )}
            </Grid>
        </>
    )
}

export const studentsRoute = "/students";
export default StudentPage;
