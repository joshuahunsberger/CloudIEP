import { Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { type FormEvent } from 'react';
import type { Student } from '../../students/Student';

const PREFIX = 'StudentForm';

const classes = {
  form: `${PREFIX}-form`,
  button: `${PREFIX}-button`,
};

const Root = styled('form')(({ theme }) => ({
  [`&.${classes.form}`]: {
    marginTop: theme.spacing(1),
  },

  [`& .${classes.button}`]: {
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
  const handleDateChange = (date: Date | null) => {
    date && setStudent({ ...student, dateOfBirth: date });
  };

  return (
    <Root className={classes.form} onSubmit={handleSubmit}>
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
        onChange={(date) => handleDateChange(date)}
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
    </Root>
  );
};

export default StudentForm;
