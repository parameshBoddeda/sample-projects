import React, { useState } from "react";
import {
    Button,
    Typography,

} from "@material-ui/core";
import { Construction, Done } from '@mui/icons-material';
import { Box, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import ClearIcon from '@mui/icons-material/Clear';
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 189px)',
        overflowY: 'auto',
    },
}));



const ScheduleMaintenance = (props) => {
    
    const handleCloseSchMaintenance = (value) => {
        // props.setShowSchMaintenance(false);
        // props.setShowTrafficking(true);
        props.setobjAccordionVisiblity.scheduleMgmt(false);
        props.setobjAccordionVisiblity.trafficking(true);
    }
        const classes = useStyles();
    
            
    return (

        <Box p={1}>
        <Grid container>
            <Grid item xs={12}>
                <GridHeader view={props.view} showIcon={true} showCheckbox={false} showScheduleIcon={true} headerText="Schedule Maintenance:">
                        <Box display="flex">
                        <IconButton size="small" onClick={handleCloseSchMaintenance}>
                            <ClearIcon />
                        </IconButton>
                    </Box>
                </GridHeader>
            </Grid>
            </Grid>
            <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
            <Grid container spacing={2}>
            <Grid item xs={4}>
                            <Typography variant="subtitle1" >
                                Set DNA
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Button variant="contained" size="small" startIcon={<Done />}>
                                Apply
                            </Button>
                        </Grid>
                <Grid item xs={4}>
                            <Typography variant="subtitle1" >
                                Reset DNA
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Button variant="contained" size="small" startIcon={<Done />}>
                                Apply
                            </Button>
                        </Grid>                
        </Grid>
        <Box component="div">
        <Grid container xs={12} justifyContent="flex-end">
                    <Button color="secondary" sx={{marginRight: '8px'}}>Cancel</Button>
                    <Button variant="contained" color="primary">Ok</Button>
                    </Grid>
                    </Box>
        </Box>
        </Box>
        
    );


}
export default ScheduleMaintenance;