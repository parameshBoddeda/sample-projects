// import * as React from 'react';
// import Select from 'react-select';
import { DataGrid } from '@mui/x-data-grid';

// const ages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';

const AgeDropdown = (props) => {
    const [age, setAge] = useState(props.value);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (event) => {
        setAge(event.target.value);
        setIsEditing(false);
        // props.setValue(event.target.value);

    };

    // const handleBlur = () => {
    //     console.log('called');
    //     setIsEditing(false);
    // };

    return (
        <>
            {isEditing ? (
                <Select
                    value={age}
                    onChange={handleChange}
                    // onBlur={handleBlur}
                    autoWidth
                >
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>
            ) : (
                <div onClick={handleEditClick}>{age}</div>
            )}
        </>
    );
};


const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130, editable: true },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
        renderCell: (params) => {
            
            return (
                <AgeDropdown value={params.value} setValue={params.setValue} />
            )
        },
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 20 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 30 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 40 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 20 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 100 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 20 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 30 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function DataTable() {
   
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                // checkboxSelection
            />
        </div>
    );
}






