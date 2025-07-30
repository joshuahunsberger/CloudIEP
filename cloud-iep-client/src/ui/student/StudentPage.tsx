import { useAuth0 } from '@auth0/auth0-react';
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { startOfDay } from 'date-fns';
import { type FormEvent, useEffect, useState } from 'react';
import deleteRequest from '../../network/deleteRequest';
import postRequest from '../../network/postRequest';
import putRequest from '../../network/putRequest';
import type { Student } from '../../students/Student';
import useStudentsApi from '../../students/useStudentsApi';
import ApiStatus from '../../types/ApiStatus';
import { useSnackbar } from '../SnackbarProvider';
import StudentForm from './StudentForm';
import StudentTable from './StudentTable';

const PREFIX = 'StudentPage';

const classes = {
  card: `${PREFIX}-card`,
  dataCard: `${PREFIX}-dataCard`,
  noStudents: `${PREFIX}-noStudents`,
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
}));

const StudentPage = () => {
  const service = useStudentsApi();
  const snackBar = useSnackbar();

  const defaultStudent: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: startOfDay(new Date()),
    goals: [],
  };

  const [isEditing, setIsEditing] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student>(defaultStudent);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (service.status === ApiStatus.Loaded) {
      setStudents(service.result);
    }
  }, [service]);

  const addStudent = async (newStudent: Student) => {
    const token = await getAccessTokenSilently();
    const result = await postRequest<Student, Student>(
      'http://localhost:5000/api/Student',
      newStudent,
      token,
    );

    if (result != null) {
      result.dateOfBirth = new Date(result.dateOfBirth);
      setStudents([...students, result]);
    }
    snackBar.openSnackbar('Student added.');
    return result;
  };

  const editStudent = async (existingStudent: Student) => {
    const token = await getAccessTokenSilently();
    await putRequest(
      'http://localhost:5000/api/Student/' + existingStudent.id,
      existingStudent,
      token,
    );

    const newStudents = students.map((student) =>
      student.id === existingStudent.id ? existingStudent : student,
    );
    setStudents(newStudents);
    snackBar.openSnackbar('Student updated.');
  };

  const deleteStudent = async (studentId: string) => {
    // TODO: Confirm?
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

  const setEditing = (id: string) => {
    const editingStudent = students.find((s) => s.id === id);
    if (editingStudent) {
      setIsEditing(true);
      setStudent(editingStudent);
    }
  };

  const cancelEditing = () => {
    setStudent(defaultStudent);
    setIsEditing(false);
  };

  const clearStudent = () => {
    setStudent(defaultStudent);
  };

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
  };

  return (
    <Root>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" align="center">
            {isEditing ? 'Edit Student' : 'Add a Student'}
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
        justifyContent="center"
        className={classes.dataCard}
      >
        {service.status === ApiStatus.Loading && <CircularProgress />}
        {service.status === ApiStatus.Loaded &&
          (service.result.length > 0 ? (
            <StudentTable
              students={students}
              setEditing={setEditing}
              deleteStudent={deleteStudent}
            />
          ) : (
            <Typography variant="h4">No Students</Typography>
          ))}
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
export default StudentPage;
