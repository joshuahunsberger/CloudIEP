import { Card, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Delete, Edit } from "@material-ui/icons";
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Student } from '../../students/Student';
import ConfirmDialog from '../ConfirmDialog';

interface StudentTableProps {
    students?: ReadonlyArray<Student>
    setEditing: (id: string) => void;
    deleteStudent: (id: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, setEditing, deleteStudent }: StudentTableProps) => {
    const [open, setOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string>();

    const promptForDelete = (studentId: string) => {
        setSelectedStudentId(studentId);
        setOpen(true);
    }

    const confirmDelete = (shouldDelete: boolean) => {
        if (shouldDelete && selectedStudentId) {
            deleteStudent(selectedStudentId);
        }
        setOpen(false);
    }

    return (
        <>
            <ConfirmDialog
                isOpen={open}
                title="Delete Student"
                content="Are you sure you want to delete this student?"
                confirmButtonText="Delete"
                declineButtonText="Cancel"
                confirm={confirmDelete}
            />
            <TableContainer component={Card}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students?.map(student => (
                            <TableRow key={student.id}>
                                <TableCell>{student.firstName}</TableCell>
                                <TableCell>{student.lastName}</TableCell>
                                <TableCell>{format(student.dateOfBirth, 'MM/dd/yyyy')}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => setEditing(student.id)}><Edit /></IconButton>
                                    <IconButton onClick={() => promptForDelete(student.id)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default StudentTable;
