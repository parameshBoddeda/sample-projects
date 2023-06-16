import * as React from 'react';
import {Grid, Box, IconButton, Paper, FormControl, Divider, Typography } from '@mui/material';
import GridHeader from '../../sharedComponents/GridHeader/GridHeader';
import InventoryScreen from './addEditInventory/InventoryScreen';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles((theme) => ({
    contentHeight: {
        height: 'calc(100vh - 130px)',
        overflowY: 'auto',
    },
}));


const InventoryDeal = (props) => {
    const classes = useStyles();
    return <Box>
        <Grid container>
            <Grid item xs={12}>
                <Box p={1}>
                    <GridHeader showIcon={true} icon={"inventoryDeal"} hideCheckbox={true} headerText="Inventory Deal">
                        <Box display="flex">
                            <IconButton size="small" onClick={props.handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </GridHeader>
                </Box>
            </Grid>
        </Grid>
        <Grid container>
            <InventoryScreen updateEnableDealEdit={props.updateEnableDealEdit} enableDealEdit={props.enableDealEdit} handleClose={props.handleClose} refreshPage={props.refreshPage} isEditing={props.isEditing} inventoryDealData={props.inventoryDealData} dealSourceId={props.dealSourceId} countDealInventoryItems={props.countDealInventoryItems}/>
        </Grid>
    </Box>
}

InventoryDeal.displayName = "InventoryDeal";
export default InventoryDeal;
