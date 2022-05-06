import { Button, Card, Grid, Paper, Typography, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Observation } from '../../goals/Goal';
import { useSnackbar } from '../SnackbarProvider';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(3, 0, 0),
  },
  card: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0),
  },
  gridRow: {
    margin: theme.spacing(2, 0, 2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}));

interface ObservationFormProps {
  addObservation: (obs: Observation) => Promise<void>;
  cancel: () => void;
}

const ObservationForm = ({ addObservation, cancel }: ObservationFormProps) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const snackBar = useSnackbar();
  const [observation, setObservation] = useState<Observation>({
    observationDate: new Date(),
    successCount: 0,
    totalCount: 0,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (observation.totalCount === 0) {
      snackBar.openSnackbar('Please enter a total greater than 0.');
    } else if (observation.successCount > observation.totalCount) {
      snackBar.openSnackbar('Success count cannot be greater than total.');
      return;
    } else {
      try {
        await addObservation(observation);
      } catch (error) {
        var errorMessage = 'Unknown Error';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        snackBar.openSnackbar('Error: ' + errorMessage);
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    date && setObservation({ ...observation, observationDate: date });
  };

  const handleSuccessChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    var success = Number(e.currentTarget.value);
    if (success < 0) success = 0;
    setObservation({
      ...observation,
      successCount: success,
    });
  };

  const handleTotalChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    var total = Number(e.currentTarget.value);
    if (total < 0) total = 0;
    setObservation({
      ...observation,
      totalCount: total,
    });
  };

  const getPercentage = () => {
    if (observation.totalCount === 0) return 0;
    const percentage =
      (100 * observation.successCount) / observation.totalCount;
    return percentage.toFixed(2);
  };

  return (
    <Card className={classes.card}>
      <Grid
        container
        item
        direction="column"
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item className={classes.gridRow}>
          <Typography variant="h6" align="center">
            Add an Observation
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid item className={classes.gridRow}>
            <DatePicker
              openTo="day"
              inputFormat="MM/dd/yyyy"
              label="Observation Date"
              views={['year', 'month', 'day']}
              value={observation?.observationDate}
              onChange={(date) => handleDateChange(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid
            container
            item
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            className={classes.gridRow}
          >
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                required
                label="Success Count"
                id="successCount"
                type="number"
                value={observation.successCount}
                onChange={handleSuccessChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Paper elevation={0} className={classes.paper}>
                <Typography>times out of</Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                required
                label="Total Count"
                id="totalCount"
                type="number"
                value={observation.totalCount}
                onChange={handleTotalChange}
              />
            </Grid>
            <Grid item xs={2}>
              <Paper elevation={0} className={classes.paper}>
                <Typography>={getPercentage()}%</Typography>
              </Paper>
            </Grid>
          </Grid>
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
      </Grid>
    </Card>
  );
};

export default ObservationForm;
