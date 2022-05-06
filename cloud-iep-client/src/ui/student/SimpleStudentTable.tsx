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
import { Delete } from '@mui/icons-material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StudentPreview } from '../../users/StudentPreview';
import ConfirmDialog from '../ConfirmDialog';

interface SimpleStudentTableProps {
  students?: ReadonlyArray<StudentPreview>;
  deleteStudent: (id: string) => void;
}

const SimpleStudentTable: React.FC<SimpleStudentTableProps> = ({
  students,
  deleteStudent,
}: SimpleStudentTableProps) => {
  const [open, setOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>();

  const promptForDelete = (studentId: string) => {
    setSelectedStudentId(studentId);
    setOpen(true);
  };

  const confirmDelete = (shouldDelete: boolean) => {
    if (shouldDelete && selectedStudentId) {
      deleteStudent(selectedStudentId);
    }
    setOpen(false);
  };

  return <>
    <ConfirmDialog
      isOpen={open}
      title="Delete Student"
      content="Are you sure you want to delete this student?"
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
            <TableCell>Student Name</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {students?.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <Link to={'/student/' + student.id}>View Student</Link>
              </TableCell>
              <TableCell>{student.fullName}</TableCell>
              <TableCell>
                <IconButton onClick={() => promptForDelete(student.id)} size="large">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>;
};

export default SimpleStudentTable;
