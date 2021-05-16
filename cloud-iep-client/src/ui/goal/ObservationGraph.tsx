import { Card, makeStyles, Typography, useTheme } from '@material-ui/core';
import { format } from 'date-fns';
import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Observation } from '../../goals/Goal';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

interface ObservationGraphProps {
  observations: ReadonlyArray<Observation>;
  goalPercentage?: number;
}

interface ObservationGraphData {
  observationDate: string;
  observationPercentage: number;
}

const ObservationGraph = ({
  observations,
  goalPercentage,
}: ObservationGraphProps) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const makeGraphData = (): ObservationGraphData[] => {
    return observations.map(
      (o) =>
        ({
          observationDate: format(o.observationDate, 'MM/dd/yyyy'),
          observationPercentage: o.successCount / o.totalCount,
        } as ObservationGraphData),
    );
  };

  return (
    <Card className={classes.card}>
      <Typography variant="h4" align="center">
        Observation History
      </Typography>
      <ResponsiveContainer height={300}>
        <LineChart data={makeGraphData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="observationDate" />
          <YAxis domain={[0, 1]} />
          <Tooltip
            formatter={(value: any) => {
              return [value, 'Observed Percentage'];
            }}
          />
          {goalPercentage && (
            <ReferenceLine
              y={goalPercentage}
              label="Goal"
              stroke="red"
              strokeDasharray="3 3"
            />
          )}
          <Line type="monotone" dataKey="observationPercentage" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ObservationGraph;
