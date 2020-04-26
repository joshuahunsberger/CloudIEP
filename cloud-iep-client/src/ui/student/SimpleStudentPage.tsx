import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import { startOfDay } from 'date-fns';
import React, { FormEvent, useEffect, useState } from 'react';
import deleteRequest from '../../network/deleteRequest';
import postRequest from '../../network/postRequest';
import { useAuth0 } from '../../react-auth0-spa';
import { Student } from '../../students/Student';
import ApiStatus from '../../types/ApiStatus';
import { StudentPreview } from '../../users/StudentPreview';
import useUsersApi from '../../users/useUserApi';
import { useSnackbar } from '../SnackbarProvider';
import SimpleStudentTable from './SimpleStudentTable';
import StudentForm from './StudentForm';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dataCard: {
    marginTop: theme.spacing(4),
  },
  noStudents: {
    align: 'center',
  },
  button: {
    margin: theme.spacing(2),
  },
}));

const SimpleStudentPage = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const service = useUsersApi();
  const snackBar = useSnackbar();

  const defaultStudent: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: startOfDay(new Date()),
    goals: [],
  };

  const [isAdding, setIsAdding] = useState(false);
  const [students, setStudents] = useState<StudentPreview[]>([]);
  const [student, setStudent] = useState<Student>(defaultStudent);
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    service.status === ApiStatus.Loaded && setStudents(service.result.students);
  }, [service]);

  const addStudent = async (newStudent: Student) => {
    const token = await getTokenSilently();
    const result = await postRequest<Student>(
      'http://localhost:5000/api/Student',
      newStudent,
      token,
    );

    if (result != null) {
      const newStudentPreview: StudentPreview = {
        id: result.id,
        fullName: result.firstName + ' ' + result.lastName,
      };
      setStudents([...students, newStudentPreview]);
    }
    snackBar.openSnackbar('Student added.');
    return result;
  };

  const deleteStudent = async (studentId: string) => {
    const token = await getTokenSilently();
    await deleteRequest(
      'http://localhost:5000/api/Student/' + studentId,
      token,
    );

    const updatedStudents = students.filter(
      (student) => student.id !== studentId,
    );
    setStudents(updatedStudents);
    snackBar.openSnackbar('Student deleted.');
  };

  const cancelEditing = () => {
    setStudent(defaultStudent);
    setIsAdding(false);
  };

  const clearStudent = () => {
    setStudent(defaultStudent);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newStudent = await addStudent(student);
    if (newStudent != null) {
      clearStudent();
    }
    setIsAdding(false);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.dataCard}
      >
        {service.status === ApiStatus.Loading && <CircularProgress />}
        {service.status === ApiStatus.Loaded && (
          <>
            {isAdding ? (
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h4" align="center">
                    Add a Student
                  </Typography>
                  <StudentForm
                    handleSubmit={handleSubmit}
                    isEditing={false}
                    cancelEditing={cancelEditing}
                    student={student}
                    setStudent={setStudent}
                  />
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => setIsAdding(true)}
              >
                Add a student
              </Button>
            )}
            {service.result.students.length > 0 ? (
              <SimpleStudentTable
                students={students}
                deleteStudent={deleteStudent}
              />
            ) : (
              <Typography variant="h4">No Students. Add one above.</Typography>
            )}
          </>
        )}
        {service.status === ApiStatus.Error && (
          <Typography variant="h6">
            There was an error getting students. {service.error.message}
          </Typography>
        )}
      </Grid>
    </>
  );
};

export const studentsRoute = '/students';
export default SimpleStudentPage;
