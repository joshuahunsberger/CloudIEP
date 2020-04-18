import { Card, CardContent, CircularProgress, Grid, makeStyles, Typography, useTheme } from '@material-ui/core';
import { startOfDay } from "date-fns";
import React, { FormEvent, useEffect, useState } from 'react';
import postRequest from '../../network/postRequest';
import putRequest from '../../network/putRequest';
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

    const defaultStudent = {
        id: "",
        firstName: "",
        lastName: "",
        dateOfBirth: startOfDay(new Date())
    };

    const [isEditing, setIsEditing] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [student, setStudent] = useState<Student>(defaultStudent);
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

    const editStudent = async (existingStudent: Student) => {
        const token = await getTokenSilently();
        await putRequest('http://localhost:5000/api/Student/' + existingStudent.id, existingStudent, token);

        const newStudents = students.map(student => student.id === existingStudent.id
            ? existingStudent
            : student);
        setStudents(newStudents);
    }

    const setEditing = (id: string) => {
        const editingStudent = students.find(s => s.id === id);
        if (editingStudent) {
            setIsEditing(true);
            setStudent(editingStudent);
        }
    }

    const cancelEditing = () => {
        setStudent(defaultStudent);
        setIsEditing(false);
    }

    const clearStudent = () => {
        setStudent(defaultStudent);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isEditing) {
            await editStudent(student);
            clearStudent();
            setIsEditing(false);
        } else {
            const newStudent = await addStudent(student);
            if (newStudent != null) {
                clearStudent();
            }
        }

    }

    return (
        <>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h4" align="center">
                        {isEditing ? "Edit Student" : "Add a Student"}
                    </Typography>
                    <StudentForm
                        handleSubmit={handleSubmit}
                        isEditing={isEditing}
                        cancelEditing={cancelEditing}
                        student={student}
                        setStudent={setStudent}
                    />
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
                        <StudentTable students={students} setEditing={setEditing} />
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
