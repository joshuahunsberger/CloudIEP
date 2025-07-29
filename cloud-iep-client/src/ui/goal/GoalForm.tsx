import { Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { type FormEvent } from 'react';
import type { Goal } from '../../goals/Goal';

const PREFIX = 'GoalForm';

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

interface GoalFormProps {
  goal: Goal;
  setGoal: (goal: Goal) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  cancel: () => void;
  isEditing?: boolean;
}

const GoalForm = ({
  goal,
  setGoal,
  handleSubmit,
  cancel,
  isEditing,
}: GoalFormProps) => {
  const handleBeginDateChange = (date: Date | null) => {
    date && setGoal({ ...goal, beginDate: date });
  };

  const handleEndDateDateChange = (date: Date | null) => {
    date && setGoal({ ...goal, endDate: date });
  };

  return (
    <Root className={classes.form} onSubmit={handleSubmit}>
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
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        type="number"
        label="Goal Percentage"
        id="goalPercentage"
        value={goal.goalPercentage}
        onChange={(e) =>
          setGoal({ ...goal, goalPercentage: Number(e.currentTarget.value) })
        }
      />
      <DatePicker
        openTo="day"
        inputFormat="MM/dd/yyyy"
        label="Goal Begin Date"
        views={['year', 'month', 'day']}
        value={goal.beginDate}
        onChange={(date) => handleBeginDateChange(date)}
        renderInput={(params) => <TextField {...params} />}
      />
      <DatePicker
        openTo="day"
        inputFormat="MM/dd/yyyy"
        label="Goal End Date"
        views={['year', 'month', 'day']}
        value={goal.endDate}
        onChange={(date) => handleEndDateDateChange(date)}
        renderInput={(params) => <TextField {...params} />}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.button}
      >
        {isEditing ? 'Update' : 'Add'}
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
    </Root>
  );
};

export default GoalForm;
