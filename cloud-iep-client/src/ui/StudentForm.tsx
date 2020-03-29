import { Button, Card, CardContent, makeStyles, TextField, Typography, useTheme } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { FormEvent, useState } from "react";
import postRequest from '../network/postRequest';
import { Student } from '../students/Student';

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function StudentForm() {
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
        console.log(student);
        postRequest<Student>('http://localhost:5000/api/Student', student)
            .then(response => console.log("New ID: " + response.id))
            .catch(error => console.log(error));
        event.preventDefault();
    }

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h4" align="center">Add a Student</Typography>
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
            </CardContent>
        </Card>
    );
}

export default StudentForm;
