import React, { useEffect, useState } from 'react';
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import { Box, IconButton, Grid, Paper} from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@mui/icons-material/Close';
import ViewReport from '../../Reports/ViewReport';
import {GetReportUrl} from '../../../services/common.service';

function notifyWarning(message) { toast.warning(message) }
function notifySuccess(message) { toast.success(message) }   


const useStyles = makeStyles((theme) => ({
    contentHeight: {
        
        '& #rptContainer, iframe': {
            height: 'calc(100vh - 189px) !important',
            overflowY: 'auto',
        }
    },
}));



const DmsInventoryReport = (props) => {
    const classes = useStyles();
    const [reportUrl, setReportUrl] = useState("");

    const handleClose = () => {
        if(props.handleReportClose) {
            props.handleReportClose();
        }

    }

    useEffect(() => {
        GetReportUrl("ReportUrls", "InventoryReportUrl").then(resp => {
            setReportUrl(resp);
        }).catch(err => {
            console.log(err);
        });
    })
    

    return (
        <>
            <ToastContainer autoClose={3000} />
            <Paper elevation={0}>
                <Grid container>
                    <Grid item xs={12}>
                        <Box p={1}>
                            <GridHeader showIcon={true} icon={"invReport"} hideCheckbox={true} headerText="DMS Inventory">
                                <Box display="flex">
                                    <IconButton size="small" onClick={handleClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </GridHeader>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container className={classes.contentHeight}>
                    <Grid item xs={12}>
                        <Box px={1} py={.5}>
                            {reportUrl && <ViewReport url={`${reportUrl.replace('<___dealId___>', props.dealId).replace('<___year___>', new Date().getFullYear())}`}/>}
                        </Box>
                    </Grid>                    
                </Grid>
            </Paper>
        </>
    )
}
DmsInventoryReport.displayName = "DmsInventoryReportComponent";
export default DmsInventoryReport;