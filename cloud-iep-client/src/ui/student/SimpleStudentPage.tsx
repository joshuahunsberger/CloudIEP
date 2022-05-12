import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { startOfDay } from 'date-fns';
import React, { FormEvent, useEffect, useState } from 'react';
import deleteRequest from '../../network/deleteRequest';
import postRequest from '../../network/postRequest';
import { Student } from '../../students/Student';
import ApiStatus from '../../types/ApiStatus';
import { StudentPreview } from '../../users/StudentPreview';
import useUsersApi from '../../users/useUserApi';
import { useSnackbar } from '../SnackbarProvider';
import SimpleStudentTable from './SimpleStudentTable';
import StudentForm from './StudentForm';

const PREFIX = 'SimpleStudentPage';

const classes = {
  card: `${PREFIX}-card`,
  dataCard: `${PREFIX}-dataCard`,
  noStudents: `${PREFIX}-noStudents`,
  button: `${PREFIX}-button`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.card}`]: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.dataCard}`]: {
    marginTop: theme.spacing(4),
  },

  [`& .${classes.noStudents}`]: {
    align: 'center',
  },

  [`& .${classes.button}`]: {
    margin: theme.spacing(2),
  },
}));

const SimpleStudentPage = () => {
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
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    service.status === ApiStatus.Loaded && setStudents(service.result.students);
  }, [service]);

  const addStudent = async (newStudent: Student) => {
    const token = await getAccessTokenSilently();
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
    const token = await getAccessTokenSilently();
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
    <Root>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
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
    </Root>
  );
};

export const studentsRoute = '/students';
export default SimpleStudentPage;
