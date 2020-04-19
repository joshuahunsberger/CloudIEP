import { Button, makeStyles, TextField, useTheme } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
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

  const handleDateChange = (date: Date | null) => {
    date && setStudent({ ...student, dateOfBirth: date });
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
      <KeyboardDatePicker
        disableFuture
        autoOk
        variant="inline"
        inputVariant="outlined"
        openTo="year"
        format="MM/dd/yyyy"
        margin="normal"
        id="dob-picker"
        label="Date of Birth"
        views={['year', 'month', 'date']}
        maxDateMessage="Date of birth cannot be in the future"
        value={student.dateOfBirth}
        onChange={(date) => handleDateChange(date)}
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
    </form>
  );
};

export default StudentForm;
