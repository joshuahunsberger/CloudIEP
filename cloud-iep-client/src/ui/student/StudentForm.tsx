import { Button, makeStyles, useTheme } from '@material-ui/core';
import { DateRange } from '@mui/lab';
import DatePicker from '@mui/lab/DatePicker';
import { TextField } from '@mui/material';
import React, { FormEvent } from 'react';
import { Student } from '../../students/Student';

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(3, 0, 0),
  },
}));

interface StudentFormProps {
  student: Student;
  setStudent: (student: Student) => void;
  isEditing: boolean;
  cancelEditing: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

const StudentForm = ({
  handleSubmit,
  student,
  setStudent,
  isEditing,
  cancelEditing,
}: StudentFormProps) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const handleDateChange = (date: DateRange<Date> | null) => {
    date && date[0] && setStudent({ ...student, dateOfBirth: date[0] });
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="First Name"
        id="firstName"
        value={student.firstName}
        onChange={(e) =>
          setStudent({ ...student, firstName: e.currentTarget.value })
        }
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Last Name"
        id="lastName"
        value={student.lastName}
        onChange={(e) =>
          setStudent({ ...student, lastName: e.currentTarget.value })
        }
      />
      <DatePicker
        disableFuture
        openTo="year"
        inputFormat="MM/dd/yyyy"
        label="Date of Birth"
        views={['year', 'month', 'day']}
        value={student.dateOfBirth}
        onChange={(date: DateRange<Date> | null) => handleDateChange(date)}
        renderInput={(params) => <TextField {...params} />}
      />
      {isEditing ? (
        <>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Update
          </Button>
        </>
      ) : (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Submit
        </Button>
      )}
      <Button
        type="reset"
        fullWidth
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={cancelEditing}
      >
        Cancel
      </Button>
    </form>
  );
};

export default StudentForm;
