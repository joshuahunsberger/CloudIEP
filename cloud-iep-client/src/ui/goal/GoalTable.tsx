import { Delete } from '@mui/icons-material';
import {
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { GoalPreview } from '../../students/GoalPreview';
import ConfirmDialog from '../ConfirmDialog';

interface GoalTableProps {
  goals?: ReadonlyArray<GoalPreview>;
  deleteGoal: (id: string) => void;
}

const GoalTable: React.FC<GoalTableProps> = ({
  goals,
  deleteGoal,
}: GoalTableProps) => {
  const [open, setOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>();

  const promptForDelete = (goalId: string) => {
    setSelectedGoalId(goalId);
    setOpen(true);
  };

  const confirmDelete = (shouldDelete: boolean) => {
    if (shouldDelete && selectedGoalId) {
      deleteGoal(selectedGoalId);
    }
    setOpen(false);
  };

  return (
    <>
      <ConfirmDialog
        isOpen={open}
        title="Delete Goal"
        content="Are you sure you want to delete this goal? You will lose any progress you have tracked."
        confirmButtonText="Delete"
        declineButtonText="Cancel"
        confirm={confirmDelete}
        forDelete={true}
      />
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Detail</TableCell>
              <TableCell>Goal Name</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {goals?.map((goal) => (
              <TableRow key={goal.goalId}>
                <TableCell>
                  <Link to={'/goal/' + goal.goalId}>View Goal</Link>
                </TableCell>
                <TableCell>{goal.goalName}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => promptForDelete(goal.goalId)}
                    size="large"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default GoalTable;
