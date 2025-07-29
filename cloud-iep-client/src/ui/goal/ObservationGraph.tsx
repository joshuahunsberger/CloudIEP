import { Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
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
import type { Observation } from "../../goals/Observation";

const PREFIX = 'ObservationGraph';

const classes = {
  card: `${PREFIX}-card`,
};

const StyledCard = styled(Card)(({ theme }) => ({
  [`&.${classes.card}`]: {
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
    <StyledCard className={classes.card}>
      <Typography variant="h4" align="center">
        Observation History
      </Typography>
      <ResponsiveContainer height={300}>
        <LineChart data={makeGraphData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="observationDate" />
          <YAxis domain={[0, 1]} />
          <Tooltip
            formatter={(value: number) => {
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
    </StyledCard>
  );
};

export default ObservationGraph;
