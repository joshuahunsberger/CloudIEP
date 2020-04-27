import React from 'react';
import { Observation } from '../../goals/Goal';
import {
  CartesianGrid,
  LineChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Typography } from '@material-ui/core';

interface ObservationGraphProps {
  observations: ReadonlyArray<Observation>;
  goalPercentage?: number;
}

interface ObservationGraphData {
  observationDate: Date;
  observationPercentage: number;
}

const ObservationGraph = ({
  observations,
  goalPercentage,
}: ObservationGraphProps) => {
  const makeGraphData = (): ObservationGraphData[] => {
    return observations.map(
      (o) =>
        ({
          observationDate: o.observationDate,
          observationPercentage: o.successCount / o.totalCount,
        } as ObservationGraphData),
    );
  };
  return (
    <>
      <Typography>Chart</Typography>
      <ResponsiveContainer height={300}>
        <LineChart data={makeGraphData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="observationDate" label="Date" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
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
    </>
  );
};

export default ObservationGraph;
