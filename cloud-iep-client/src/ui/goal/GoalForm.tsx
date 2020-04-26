import { Button, makeStyles, TextField, useTheme } from '@material-ui/core';
import React, { FormEvent } from 'react';
import { Goal } from '../../goals/Goal';
import { KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(3, 0, 0),
  },
}));

interface GoalFormProps {
  goal: Goal;
  setGoal: (goal: Goal) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  cancel: () => void;
}

const GoalForm = ({ goal, setGoal, handleSubmit, cancel }: GoalFormProps) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const handleBeginDateChange = (date: Date | null) => {
    date && setGoal({ ...goal, beginDate: date });
  };

  const handleEndDateDateChange = (date: Date | null) => {
    date && setGoal({ ...goal, endDate: date });
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Goal Name"
        id="goalName"
        value={goal.goalName}
        onChange={(e) => setGoal({ ...goal, goalName: e.currentTarget.value })}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Goal Description"
        id="goalDescription"
        value={goal.goalDescription}
        onChange={(e) =>
          setGoal({ ...goal, goalDescription: e.currentTarget.value })
        }
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Goal Category"
        id="goalCategory"
        value={goal.category}
        onChange={(e) => setGoal({ ...goal, category: e.currentTarget.value })}
      />
      <KeyboardDatePicker
        autoOk
        variant="inline"
        inputVariant="outlined"
        openTo="year"
        format="MM/dd/yyyy"
        margin="normal"
        id="goal-begin-date-picker"
        label="Goal Begin Date"
        views={['year', 'month', 'date']}
        value={goal.beginDate}
        onChange={(date) => handleBeginDateChange(date)}
      />
      <KeyboardDatePicker
        autoOk
        variant="inline"
        inputVariant="outlined"
        openTo="year"
        format="MM/dd/yyyy"
        margin="normal"
        id="goal-end-date-picker"
        label="Goal End Date"
        views={['year', 'month', 'date']}
        value={goal.endDate}
        onChange={(date) => handleEndDateDateChange(date)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Add
      </Button>
      <Button
        type="reset"
        fullWidth
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={cancel}
      >
        Cancel
      </Button>
    </form>
  );
};

export default GoalForm;
