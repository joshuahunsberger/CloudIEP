import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from '@material-ui/core';
import { Observation } from '../../goals/Goal';
import { format } from 'date-fns';

interface ObservationTableProps {
  observations: ReadonlyArray<Observation>;
}

const ObservationTable = ({ observations }: ObservationTableProps) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableCell>Observation Date</TableCell>
          <TableCell>Success Count</TableCell>
          <TableCell>Total Count</TableCell>
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
