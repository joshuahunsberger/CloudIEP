import { Button, makeStyles, TextField, useTheme } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { FormEvent, useState } from "react";
import { Student } from '../students/Student';

const useStyles = makeStyles((theme) => ({
    form: {
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface StudentFormProps {
    addStudent: (newStudent: Student) => void;
}

const StudentForm = ({ addStudent }: StudentFormProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const [student, setStudent] = useState<Student>({
        id: "",
        firstName: "",
        lastName: "",
        dateOfBirth: new Date()
    });

    const handleDateChange = (date: Date | null) => {
        date && setStudent({ ...student, dateOfBirth: date })
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addStudent(student);
    }

    return (
        <form className={classes.form}
            onSubmit={handleSubmit}
        >
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="First Name"
                id="firstName"
                value={student.firstName}
                onChange={e => setStudent({ ...student, firstName: e.currentTarget.value })}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Last Name"
                id="lastName"
                value={student.lastName}
                onChange={e => setStudent({ ...student, lastName: e.currentTarget.value })}
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
                views={["year", "month", "date"]}
                maxDateMessage="Date of birth cannot be in the future"
                value={student.dateOfBirth}
                onChange={date => handleDateChange(date)}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Submit
            </Button>
        </form>
    );
}

export default StudentForm;
