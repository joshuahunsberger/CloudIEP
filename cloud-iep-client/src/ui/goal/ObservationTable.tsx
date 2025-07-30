import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { format } from 'date-fns';
import type { Observation } from '../../goals/Observation';

interface ObservationTableProps {
  observations: ReadonlyArray<Observation>;
}

const ObservationTable = ({ observations }: ObservationTableProps) => {
  return (
    <TableContainer component={Card}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Observation Date</TableCell>
            <TableCell>Success Count</TableCell>
            <TableCell>Total Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {observations.map((observation) => (
            <TableRow key={observation.observationDate.toString()}>
              <TableCell>
                {format(observation.observationDate, 'MM/dd/yyyy')}
              </TableCell>
              <TableCell>{observation.successCount}</TableCell>
              <TableCell>{observation.totalCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ObservationTable;
