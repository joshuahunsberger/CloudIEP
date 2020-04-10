import { Card, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Delete, Edit } from "@material-ui/icons";
import React from 'react';
import { Student } from '../../students/Student';

interface StudentTableProps {
    students?: ReadonlyArray<Student>
}

const StudentTable: React.FC<StudentTableProps> = ({ students }: StudentTableProps) => {
    return (
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
                            <TableCell>{student.dateOfBirth}</TableCell>
                            <TableCell>
                                <IconButton><Edit /></IconButton>
                                <IconButton><Delete /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default StudentTable;
