import React, { useState, useEffect, useContext } from 'react';
import { Checkbox, Container, Grid, Box, Typography, Button, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { makeStyles } from '@material-ui/core/styles';
import DrawerComponent from '../../../sharedComponents/Drawer/DrawerComponent';
import { SaveCopySchedule } from  '../../../services/inventory.service';
import { ToastContainer, toast } from "react-toastify";
import ConfrimDialog from '../../../sharedComponents/Dialog/ConfirmDialog';
import { TrendingUp } from '@mui/icons-material';
import * as AppConstants from '../../../common/AppConstants';
import * as AppLanguage from '../../../common/AppLanguage';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles((theme) => ({
    copyScheduleDrawer: {
        '& .MuiDrawer-paper': {
            width: 'calc(100vw - 73px)',
            margin: '0 0 0 65px',
            padding: theme.spacing(2, 1),
        },
    },
    btnMargin: {
        marginLeft: theme.spacing(3), 'px !important': ''
    }
}));

const CopySchedule = (props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFrequencies, setSelectedFrequencies] = useState([]);
    const [selectedFrequency, setSelectedFrequency] = useState(-1);
    const classes = useStyles();

    function notifySuccess(message) { toast.success(message) }            
    function notifyWarning(message) { toast.warning(message) }
    function notifyError(msg) { toast.error(msg)  }
    
    const saveCopySchedule = (copyScheduleParams) => {
        SaveCopySchedule(copyScheduleParams).then(data => {
            if (data) {
                notifySuccess(AppLanguage.APP_MESSAGE.API_Schedule_Copy_Success);
                props.clearData();
                props.refreshPage();
            }
        }).catch(err => {
            notifyError(AppLanguage.APP_MESSAGE.Notification_Err);
            console.log(err)
        })
    }
    
    const handleFreqChecked = (id) => {
        if(props.destIds.length > 0){
            setOpenDialog(true);
            setSelectedFrequency(id);
        } else {
            addFrequency(id);
        }
    } 
    
    const addFrequency = (id) =>  {

        let frequencies = [...selectedFrequencies];
        if(frequencies.length > 0){
            let found = false;
            frequencies.map((f, i) => {
                if(f.id === id) {
                    frequencies = frequencies.filter(fliterEle => fliterEle.id !== id);
                    found = true;
                }
            });
            if(!found) {                
                frequencies.push({id: id, startDate: props.copyData[id].startDate, endDate: props.copyData[id].endDate});
            }       
                    
        } else {
            frequencies.push({id: id, startDate: props.copyData[id].startDate, endDate: props.copyData[id].endDate});
        }

        var startDate = "";
        var endDate = "";

        if(frequencies.length > 0)
        {
            startDate = frequencies.reduce((a, b) => {
                return new Date(a.startDate) < new Date(b.startDate) ? a : b;
            }).startDate;

            endDate = frequencies.reduce((a, b) => {
                return new Date(a.endDate) > new Date(b.endDate) ? a : b;
            }).endDate;
        }

        if (props.handleCSCheckFrequency) {
            props.handleCSCheckFrequency(frequencies.length > 0, startDate, endDate);
        }

        setOpenDialog(false);
        setSelectedFrequencies(frequencies);
        setSelectedFrequency(-1);
    }

    const handleCSFReSelDialogOK = (id) => {
        addFrequency(id);
        if (props.handleCSReset) {
            props.handleCSReset();
        }
    }

    const handleCSFReSelDialogCancel = () => {
        setOpenDialog(false);
        setSelectedFrequency(-1);
    }

    const handleCancel = () => {
          setSelectedFrequency(-1);
          setSelectedFrequencies([]);
          if (props.handleCSClose) {
            props.handleCSClose();
        }
    };

    const handleConifrm = () => {        
        var result = [];
        
        props.destIds.map((ele, index) => {
            result.push(ele.id)
        });

        var freqsData = [];
        var selFrequencies = selectedFrequencies;
        props.copyData.map((ele, index) => {
            selFrequencies.map((f, i) => {
                if(f.id === index){
                    freqsData.push(ele)
                }
            })
            
        });

        if(freqsData.length <= 0) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "atleast one frequency item from the copy frequency list"));
            return false;
        }

        if(result.length <= 0) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "atleast one destincation item from the inventory list"));
            return false;
        }

        var newFreqsData = freqsData.map(obj => {
            obj.ActionType = AppConstants.Inventory.ActionType;
            return obj;
        } 
        )

        let copyScheduleParams = {}
        copyScheduleParams['inventoryIds'] = [...result]
    
        copyScheduleParams['inventoryScheduleParamInfo'] = newFreqsData;
        saveCopySchedule(copyScheduleParams)

        setSelectedFrequency(-1);
        setSelectedFrequencies([]);
        if (props.handleCSClose) {
          props.handleCSClose();
        }

    };
    
    return (
        <>
            <DrawerComponent open={props.show} handleDrawerClose={props.handleCSClose} handleDrawerOpen={props.handleCSOpen}
                className={classes.copyScheduleDrawer}>
                <Box component="div" display="flex" alignItems="center">
                    <IconButton size="small" color="secondary">
                        <ContentCopyIcon />
                    </IconButton>
                    <Typography variant="subtitle1" fontWeight="medium" color="primary">Copy Schedule</Typography>
                </Box>
                <Box display="flex" pt={1} pl={1.5}>
                    <Container>
                        <Grid container>
                            <Grid item xs={.5}>
                                <Typography variant="caption"></Typography>
                            </Grid>
                            <Grid item xs={1.25}>
                                <Typography variant="caption">Start Date</Typography>
                            </Grid>
                            <Grid item xs={1.25}>
                                <Typography variant="caption">End Date</Typography>
                            </Grid>
                            <Grid item xs={1.25}>
                                <Typography variant="caption">End After</Typography>
                            </Grid>
                            <Grid item xs={1.25}>
                                <Typography variant="caption">Time</Typography>
                            </Grid>
                            <Grid item xs={1.25}>
                                <Typography variant="caption">Frequency</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="caption">Days</Typography>
                            </Grid>
                        </Grid>
                        <Box maxHeight={74} overflow="auto">
                            {props.copyData.map((data, index) => {
                                return <Grid container alignItems="center">
                                    <Grid item xs={.5}>
                                        <Checkbox checked={ selectedFrequencies.find(f => f.id === index) ? true : false } size="small"  onChange={() => handleFreqChecked(index)} {...label} />
                                    </Grid>
                                    <Grid item xs={1.25}>
                                        <Typography variant="caption" fontWeight="medium">{data.startDate}</Typography>
                                    </Grid>
                                    <Grid item xs={1.25}>
                                        <Typography variant="caption" fontWeight="medium">{data.endDate}</Typography>
                                    </Grid>
                                    <Grid item xs={1.25}>
                                        <Typography variant="caption" fontWeight="medium">{data.endAfter <= 0 ? "" : data.endAfter }</Typography>
                                    </Grid>
                                    <Grid item xs={1.25}>
                                        <Typography variant="caption" fontWeight="medium">{data.estAirTime}</Typography>
                                    </Grid>
                                    <Grid item xs={1.25}>
                                        <Typography variant="caption" fontWeight="medium">{data.frequency}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography variant="caption" fontWeight="medium">{data.days}</Typography>
                                    </Grid>
                                </Grid>
                            })}
                        </Box>
                        <Box display="flex" justifyContent="flex-end" mt={1}>
                            <Button size="small" onClick={handleCancel} color="secondary" >{'Cancel'}</Button>
                            <Button size="small" variant="contained" onClick={handleConifrm} color="primary" className={classes.btnMargin}>{'Confirm'}</Button>
                        </Box>
                        {selectedFrequency >= 0 && <ConfrimDialog open={openDialog} title={'Copy Schedule'} description={'This will remove all the items from the destination list, are you sure?'} ok={'OK'} cancel={'Cancel'} handleDialogOk={() => handleCSFReSelDialogOK(selectedFrequency)} handleDialogCancel={() => handleCSFReSelDialogCancel()}></ConfrimDialog>}
                    </Container>
                </Box>


            </DrawerComponent>
        </>
    );
}

CopySchedule.displayName = "CopySchedule";
export default CopySchedule;