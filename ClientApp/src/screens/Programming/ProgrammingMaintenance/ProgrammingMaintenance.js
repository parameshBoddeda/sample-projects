import React, { useState } from "react";
import { IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { GetCostTypes } from "../../../services/common.service";

import {
    Button,
    Typography,

} from "@material-ui/core";
import { Construction, Done } from '@mui/icons-material';
import InventoryData from '../../../static/Inventory.json';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

let datarows = InventoryData.rows;

// console.log(datarows);
const ProgrammingMaintenance = (props) => {

     const dropDownData = ["Paid", "Institutional", "Sales", "No Charge", "Bonus"];
     const [costTypedata, setCostTypeData] = useState([]);

    const unitCostType = [
        { label: 'Paid', year: 1994 },
        { label: 'Institutional', year: 1972 },
        { label: 'Sales', year: 1974 },
        { label: 'No Charge', year: 2008 },
        { label: 'Bonus', year: 1957 },
    ]
    let UnitCostType = "Unit COst Type";
    const datacolumns = [
        { field: 'unitType', headerName: 'Unit Type'},
        { field: 'unitCostType', headerName: 'Unit Cost Type'},
        { field: 'unitSize', headerName: 'Unit Size'}
        // { field: 'IsSellable', headerName: 'Is Sellable', width: 200 },
        // { field: 'NewUnitS', headerName: 'New UnitS', width: 200, IsEditable: true },

    ];

   
    function IsSellable() {
        const [selectionModel, setSelectionModel] = React.useState(() =>
            datarows.filter((r) => r.UnitCostType != 'Institutional').map((r) => r.id),
        );
    }

    const getCostTypes = () => {
        GetCostTypes().then(costtypedata => {
            setCostTypeData(costtypedata);
        }).catch(err => {
            throw err;
        });
    }
    return (
        <Box component={Paper} pl={2} pr={2}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Box component="div" display="flex" pt={1} pb={1}>
                        <Construction />
                        <Typography variant="body1" >
                            Programming Maintenance:
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" >
                                Set DNA
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" size="small" startIcon={<Done />}>
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" >
                                Reset DNA
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" size="small" startIcon={<Done />}>
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1">
                                Mark Unit(s) as Sellable
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" size="small" startIcon={<Done />}>
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    <Autocomplete
                        size="small"
                        disablePortal
                        id="costType"
                        options={unitCostType}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Unit Cost Type" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1">
                            Add Inventory
                            </Typography>
                        </Grid>
                        
                    </Grid>
                </Grid>
              
                <Grid item xs={12} sx={{height:'200px'}}>
                    <DataGrid
                        rows={datarows}
                        columns={datacolumns}
                        pageSize={10}
                    // checkboxSelection
                    // selectionModel={selectionModel}
                    // onSelectionModelChange={setSelectionModel}
                    />
                </Grid>
            </Grid>
        </Box>

    );


}

export default ProgrammingMaintenance;