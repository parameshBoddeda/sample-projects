import React, { useState, useEffect, useContext } from 'react';
import AppDataContext from '../../../common/AppContext';
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import { Box, IconButton, Grid, Select, MenuItem, InputLabel, FormControl, TextField, FormControlLabel, Button, Snackbar } from '@mui/material';
import PickDate from '../../../sharedComponents/PickDate/PickDate';
import ChipsList from '../../../sharedComponents/chips/ChipsList';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@mui/material/Alert';
import * as AppConstants from '../../../common/AppConstants';
import TimePicker from '../../../sharedComponents/TimePicker/TimePicker';
import { GetInventoryUnit, SaveInventoryUnit } from "../../../services/inventory.service";
import { DeleteInventoryUnit } from "../../../services/inventory.service";
import { GetUnitSizes } from '../../../services/common.service';
import Typography from '@mui/material/Typography';
import Helper from '../../../common/Helper';
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";
import ConfrimDialog from '../../../sharedComponents/Dialog/ConfirmDialog';
import { GetCostTypes, GetUnitTypes } from '../../../services/common.service';
import * as AppLanguage from '../../../common/AppLanguage';

// if (typeof window !== "undefined") {
//     injectStyle();
// }

const useStyles = makeStyles((theme) => ({
    radioGroupPadding: {
        paddingBottom: theme.spacing(1),
    },
    contentHeight: {
        height: 'calc(100vh - 456px)',
        overflowY: 'auto',
    },
    contentHeightOnlyView: {
        height: 'calc(100vh - 338px)',
        overflowY: 'auto',
    },
    containerWidth: {
        width: '100% !important',
        marginLeft: '0 !important',
    },
    Alert: {
        margin: theme.spacing(1),
    },
    spliUnitHeader: {
        backgroundColor: '#f8f8f8'
    },
    units: {
        height: theme.spacing(6),
        marginTop: theme.spacing(1.5),
    },
    unitGrid: {
        height: theme.spacing(24),
        overflowY: 'scroll'
    }
}));

function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }
function notifyError(msg) { toast.error(msg) }

const SplitUnit = (props) => {

    const classes = useStyles();
    const [totalSecondsSales, setTotalSecondsSales] = useState(null);
    const [totalSecondsInstitutional, setTotalSecondsInstitutional] = useState(null);
    const [unitSizeData, setUnitSizeData] = useState([]);
    const [costType, setCostType] = useState('');
    const [costTypeName, setCostTypeName] = useState('');
    const [unitType, setUnitType] = useState('');
    const [unitTypeName, setUnitTypeName] = useState('');
    const [unitSize, setUnitSize] = useState('');
    const [unitSizeName, setUnitSizeName] = useState('');
    const [unitCount, setUnitCount] = useState('');
    const [splitUnitData, setSplitUnitData] = useState();
    const [userCreatedData, setUserCreatedData] = useState([]);
    const { username, userId, unitTypeData, costTypeData } = useContext(AppDataContext);
    const [openDialog, setOpenDialog] = useState(false);
    const [invIndex, setInvIndex] = useState(0);
    const [startDate, setStartDate] = useState(props.seasonStartDate);
    const [endDate, setEndDate] = useState(props.seasonEndDate);
    //const [costTypeData, setCostTypeData] = useState(costType);
    const [unitTypeRecords, setUnitTypeRecords] = useState([]);
    
    useEffect(() => {
        if(splitUnitData) {
            setTotalSecondsSales(splitUnitData.length > 0 ? splitUnitData.filter(({ costTypeName }) => costTypeName !== 'Institutional').reduce((a, b) => a + (parseInt(b['unitSizeName'], 10) || 0), 0) : [])
        setTotalSecondsInstitutional(splitUnitData.length > 0 ? splitUnitData.filter(({ costTypeName }) => costTypeName === 'Institutional').reduce((a, b) => a + (parseInt(b['unitSizeName'], 10) || 0), 0) : [])

        }
        
    }, [splitUnitData])

    const saveInventoryUnit = (splitData) => {
        props.showLoading(true);
        props.openBackdrop(true);
        SaveInventoryUnit(splitData).then(data => {
            if (data) {
                notifySuccess(AppLanguage.APP_MESSAGE.API_Success)
                getInventoryUnit(props.inventoryId);
            }
            props.showLoading(false);
            props.openBackdrop(false);
            setUserCreatedData([]);
        }).catch(err => {
            props.showLoading(false);
            props.openBackdrop(false);
            notifyError(AppLanguage.APP_MESSAGE.Notification_Err)
            console.log(err)
        })
    }

    const getInventoryUnit = (id) => {
        // props.showLoading(true);
        // props.openBackdrop(true);
        GetInventoryUnit(id).then((data) => {
            setSplitUnitData(data);
            props.showLoading(false);
            props.openBackdrop(false);
        }).catch(err => {
            console.log(err);
            props.showLoading(false);
            props.openBackdrop(false);
        })
    }

    const deleteInventoryUnit = (deleteData) => {
        props.showLoading(true);
        props.openBackdrop(true);
        DeleteInventoryUnit(deleteData).then(data => {
            if (data) {
                notifySuccess('Data deleted successfully')
            }
            props.showLoading(false);
            props.openBackdrop(false);
        }).catch(err => {
            notifyError(AppLanguage.APP_MESSAGE.Notification_Err);
            props.showLoading(false);
            props.openBackdrop(false);
            console.log(err)
        })
    }
    const getUnitSizes = (id) => {
        GetUnitSizes(id).then((data) => {
            let unitSizeData = [];
            data.map(item => {
                unitSizeData.push({ label: item.unitSize, value: item.id, unitTypeId: item.unitTypeId });
            });
            setUnitSizeData(unitSizeData);
        }).catch(err => console.log(err))
    }

    const handleCostType = (name,value) => {
        setCostType(value.value);
        setCostTypeName(value.label);
    }
    const handleUnitType = (name, value) => {
        setUnitType(value.value);
        setUnitTypeName(value.label);
        setUnitSize()
        setUnitSizeName();
        getUnitSizes(value.value);

    }
    const handleUnitSize = (name,value) => {
        setUnitSize(value.value)
        setUnitSizeName(value.label);
    }
    const handleUnitCount = (e) => {
        setUnitCount(e.target.value);
    }
    const handleStartDate = (date) => {
        setStartDate(Helper.FormatDate(date));

    }

    const handleEndDate = (date) => {
        setEndDate(Helper.FormatDate(date));

    }

    const handleSplitGrid = (costTypeId, costTypeName, unitTypeId, unitTypeName, unitSizeId, unitSizeName, unitCount, startDate, endDate) => {
        if (costTypeName === '' || costTypeName === undefined || costTypeName === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", 'Cost Type'));
            return;
        }
        if (costTypeId === '' || costTypeId === undefined || costTypeId === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Split_Unit_Data_Issue.replace('__Field__', 'Cost Type'));
            return;
        }
        if (unitTypeName === '' || unitTypeName === undefined || unitTypeName === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", 'Unit Type'));
            return;
        }
        if (unitTypeId === '' || unitTypeId === undefined || unitTypeId === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Split_Unit_Data_Issue.replace('__Field__', 'Unit Type'));
            return;
        }
        if (unitSizeName === '' || unitSizeName === undefined || unitSizeName === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", 'Unit Size'));
            return;
        }
        if (unitSizeId === '' || unitSizeId === undefined || unitSizeId === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Split_Unit_Data_Issue.replace('__Field__', 'Unit Size'));
            return;
        }

        if (unitCount === '' || unitCount === undefined || unitCount === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Unit_Count_Req_Validation);
            return;
        }
        if (unitCount < 1) {
            notifyWarning(AppLanguage.APP_MESSAGE.Unit_Count_Validation);
            return;
        }
        if (startDate === '' || startDate === undefined || startDate === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", 'Start Date'));
            return;
        }
        if (endDate === '' || endDate === undefined || endDate === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", 'End Date'));
            return;
        }
        if ((Helper.FormatToIsoDate(startDate)) > Helper.FormatToIsoDate(endDate)) {
            notifyWarning(AppLanguage.APP_MESSAGE.Date_Validation)
            return;
        }
        // if (endDate < startDate) {
        //     notifyWarning('Make sure end date is greater than or equals to start date')
        //     return;
        // }
        if ((Helper.FormatToIsoDate(startDate) < Helper.FormatToIsoDate(props.seasonStartDate)) || (Helper.FormatToIsoDate(endDate) > Helper.FormatToIsoDate(props.seasonEndDate))) {
            notifyWarning(AppLanguage.APP_MESSAGE.Season_Date_Validation)
            return;
        }
        let dbSplitData = [...splitUnitData]
        let localSplitData = [...userCreatedData];
        //console.log(costTypeId, costTypeName, unitTypeId, unitTypeName, unitSizeId, unitSizeName, unitCount)
        var id = Math.floor(Math.random() * 900) * -1
        for (let i = 0; i < unitCount; i++) {
            let obj = {
                'id': id,
                'ActionType': 752,
                'ActionDate': Helper.FormatDate(new Date()),
                'InventoryId': props.inventoryId,
                'costTypeId': costTypeId,
                'costTypeName': costTypeName,
                'unitTypeId': unitTypeId,
                'unitTypeName': unitTypeName,
                'unitSizeId': unitSizeId,
                'unitSizeName': unitSizeName,
                'unitCount': unitCount,
                'user': username,
                'startDate': startDate,
                'endDate': endDate,
            };
            dbSplitData.push(obj);
        }

        for (var i = 0; i < dbSplitData.length; i++) {
            dbSplitData[i].index = i + 1;
        }

        localSplitData.push({
            'id': id,
            'ActionType': 752,
            'ActionDate': Helper.FormatDate(new Date()),
            'InventoryId': props.inventoryId,
            'costTypeId': costTypeId,
            'costTypeName': costTypeName,
            'unitTypeId': unitTypeId,
            'unitTypeName': unitTypeName,
            'unitSizeId': unitSizeId,
            'unitSizeName': unitSizeName,
            'unitCount': unitCount,
            'user': username,
            'startDate': startDate,
            'endDate': endDate
        })
        setUserCreatedData(localSplitData)
        setSplitUnitData(dbSplitData);
        handleClear();
    }

    const handleClear=()=>{
        setUnitType('');
        setUnitTypeName('');
        setCostType('');
        setCostTypeName('');
        setUnitSizeName('');
        setUnitSize('');
        setUnitCount('');
    }

    const handleConfirm = () => {
        if (userCreatedData.length > 0) {
            {
                saveInventoryUnit(userCreatedData);
                setUserCreatedData([]);
            }

        }
        else
            notifyWarning(AppLanguage.APP_MESSAGE.Confirm_Unit_Warning)
    }
    const handleClose = () => {
        setUserCreatedData([]);
        props.handleClose();
    }

    const handleDialogOpen = (index) => {
        setInvIndex(index);
        setOpenDialog(true);
    };

    const handleDialogCancel = () => {
        setOpenDialog(false);
    };



    const handleDeleteUnit = (item, invCounter) => {
        setOpenDialog(false);
        var inventoryId = item.id;
        if (inventoryId > 0) {
            let dbDeleteData = [...splitUnitData]
            var index = dbDeleteData.findIndex(e => e.id == inventoryId);
            if (index !== -1) {
                dbDeleteData.splice(index, 1);
                for (var i = 0; i < dbDeleteData.length; i++) {
                    dbDeleteData[i].index = i + 1;
                }
                setSplitUnitData(dbDeleteData);
            } else {
                notifyWarning(AppLanguage.APP_MESSAGE.Unavailable_Inventory_Item);
            }

            let localDeleteData = [...userCreatedData];
            localDeleteData.push({
                'ActionType': 753,
                'ActionDate': Helper.FormatDate(new Date()),
                'InventoryId': props.inventoryId,
                'inventoryUnitId': inventoryId,
                'costTypeId': item.costTypeId,
                'costTypeName': item.costTypeName,
                'unitTypeId': item.unitTypeId,
                'unitTypeName': item.unitTypeName,
                'unitSizeId': item.unitSizeId,
                'unitSizeName': item.unitSizeName,
                'unitCount': '1',
                'user': item.username,
                'startDate': item.startDate,
                'endDate': item.endDate
            })
            //setUserCreatedData(localDeleteData);
            //console.log(localDeleteData);
            deleteInventoryUnit(localDeleteData);
        } else {
            //Delete from UI
            let dbDeleteData = [...splitUnitData]
            var index = dbDeleteData.findIndex(e => e.index == invCounter);
            if (index !== -1) {
                dbDeleteData.splice(index, 1);
                for (var i = 0; i < dbDeleteData.length; i++) {
                    dbDeleteData[i].index = i + 1;
                }
                setSplitUnitData(dbDeleteData);
            } else {
                notifyWarning(AppLanguage.APP_MESSAGE.Unavailable_Inventory_Item);
            }
            //Reduce the unitCount from add inventory
            let localDeleteData = [...userCreatedData];
            var index = localDeleteData.findIndex(e => e.id == inventoryId);
            if (index !== -1) {
                if (localDeleteData[index].unitCount > 1) {
                    localDeleteData[index].unitCount = localDeleteData[index].unitCount - 1;
                } else {
                    localDeleteData.splice(index, 1);
                }
                setUserCreatedData(localDeleteData);
            }
        }
    }

    useEffect(()=> {
        getInventoryUnit(props.inventoryId);
        let unitTypeD = unitTypeData.filter(ele => 
            ele.mediaTypeId === props.MediaTypeId
        );
        setUnitTypeRecords(unitTypeD);
    }, [props.inventoryId])

    return (
        <>
            <ToastContainer autoClose={3000} />
            <Box p={1}>
                <Grid container>
                    <Grid item xs={12}>
                        <Box display="flex" flexDirection='row' justifyContent="space-between">
                            <IconButton title={props.onlyViewSplit ? 'View Unit' : 'Split Unit'} size="small">
                                <CallSplitOutlinedIcon color="secondary" />
                            </IconButton>
                            <GridHeader hideExpendIcon={props.hideExpendIcon} fullwidth={true} hideCheckbox={true} headerText={props.onlyViewSplit ? 'View Unit' : 'Split Unit'}>
                                {!props.onlyViewSplit && <Box display="flex">
                                    <IconButton size="small" onClick={handleClose} href="#rowFocus">
                                        <CloseIcon />
                                    </IconButton>
                                </Box>}
                            </GridHeader>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5}>

                {!props.onlyViewSplit && <Grid container alignItems="center" className={classes.containerWidth}>

                    <Grid item xs={2.5} className={classes.spliUnitHeader}>
                        <Box p={1}>
                            <Typography variant="subtitle2">Unit Type</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={2.5} className={classes.spliUnitHeader}>
                        <Box p={1}>
                            <Typography variant="subtitle2">Cost Type</Typography>
                        </Box>
                    </Grid>
                   
                    <Grid item xs={2.5} className={classes.spliUnitHeader}>
                        <Box p={1}>
                            <Typography variant="subtitle2">Unit Size</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4.5} className={classes.spliUnitHeader}>
                        <Box p={1}>
                            <Typography variant="subtitle2">Unit Count</Typography>
                        </Box>
                    </Grid>
                  
                    <Grid item xs={2.5}>
                        <Box px={1}>
                            <FormControl fullWidth>

                            <Dropdown size="small" 
                            id="unitType-select" variant="outlined" 
                            showLabel={true} lbldropdown="UnitType"
                             handleChange={handleUnitType} value={unitTypeName}
                             ddData={unitTypeRecords ? unitTypeRecords : []}
                             />
                                
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={2.5}>
                        <Box px={1}>
                            <FormControl fullWidth>
                            <Dropdown size="small" 
                            id="costType-select" variant="outlined" 
                            showLabel={true} lbldropdown="CostType"
                             handleChange={handleCostType} value={costTypeName}
                             ddData={ costTypeData ? costTypeData : []} />

                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={2.5}>
                        <Box px={1}>
                            <FormControl fullWidth>
                            <Dropdown size="small" 
                            id="unitSize-select" variant="outlined" 
                            showLabel={true} lbldropdown="UnitSize"
                             handleChange={handleUnitSize} value={unitSizeName}
                             ddData={unitSizeData ? unitSizeData : []} />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={2.5}>
                        <Box px={1}>
                            <TextField id="unit-count" size="small" variant="outlined"
                                type="number"
                                InputProps={{
                                    inputProps: {
                                        max: 100, min: 1
                                    }
                                }}
                                value={unitCount} onChange={handleUnitCount} />
                        </Box>
                    </Grid>
                    <Grid item xs={3.5}>
                        <Box p={1}>
                            <PickDate size="small" setDefaultValue={true} initialValue={props.seasonStartDate} setDate={handleStartDate} label="Start Date" />
                        </Box>
                    </Grid>
                    <Grid item xs={3.5}>
                        <Box p={1}>
                            <PickDate size="small" setDefaultValue={true} initialValue={props.seasonEndDate} setDate={handleEndDate} label="End Date" />
                        </Box>
                    </Grid>
                    <Grid container xs={5} justifyContent="flex-end">
                        <Box px={1}>
                            <IconButton title="Add Unit" size="small" onClick={() => handleSplitGrid(costType, costTypeName, unitType, unitTypeName, unitSize, unitSizeName, unitCount, startDate, endDate)}>
                                <AddCircleRoundedIcon color='primary' />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>}

                <Grid container alignItems="center" className={classes.containerWidth}>
                    <Grid item xs={12} className={classes.units}>
                        <Box p={1} display='flex' justifyContent='space-between'>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                Units
                            </Typography>
                            <Box display="flex">
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                    Paid: {totalSecondsSales}
                                </Typography>
                                <Box px={.75} lineHeight={1.7}>
                                    |
                                </Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                    Institutional: {totalSecondsInstitutional}
                                </Typography>
                            </Box>

                        </Box>
                    </Grid>
                  
                    <Grid item xs={2.5} className={classes.spliUnitHeader}>
                        <Box p={1}>
                            <Typography variant='subtitle2'>Unit Type</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={2.5} className={classes.spliUnitHeader}>
                        <Box p={1}>
                            <Typography variant='subtitle2'>Cost Type</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={2} className={classes.spliUnitHeader}>
                        <Box p={1}>
                            <Typography variant='subtitle2'>Unit Size</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={2} className={classes.spliUnitHeader}>
                        <Box p={1}>
                            <Typography variant='subtitle2'>Start Date</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3} className={classes.spliUnitHeader}>
                        <Box p={1}>
                            <Typography variant='subtitle2'>End Date</Typography>
                        </Box>
                    </Grid>

                </Grid>
                <Box className={props.onlyViewSplit ? classes.contentHeightOnlyView : classes.contentHeight}>
                    <Grid container className={classes.containerWidth}>
                        {splitUnitData && splitUnitData.length > 0 && splitUnitData.map((item, index) => {
                            if (item)
                                return <>
                                    <Grid item xs={2.5}>
                                        <Box px={1} py={.5}>
                                            <Typography variant='subtitle1'>
                                                {item.unitTypeName}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2.5}>
                                        <Box px={1} py={.5}>
                                            <Typography variant='subtitle1'>
                                                {item.costTypeName}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Box px={1} py={.5}>
                                            <Typography variant='subtitle1'>
                                                {item.unitSizeName}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Box px={1} py={.5}>
                                            <Typography variant='subtitle1'>
                                                {Helper.FormatDate(item.startDate)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Box px={1} py={.5}>
                                            <Typography variant='subtitle1'>
                                                {Helper.FormatDate(item.endDate)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    {!props.onlyViewSplit && item.isDeleted == 0 && <Grid item xs={1}>
                                        <Box px={1} py={.5}>
                                            <IconButton title="Delete Unit" size="small" color="secondary" onClick={() => handleDialogOpen(index + 1)}>
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                            {item.index === invIndex && <ConfrimDialog open={openDialog} title={'Delete Units'} description={'Are you sure, You want to delete units?'} ok={'OK'} cancel={'Cancel'} handleDialogOk={() => handleDeleteUnit(item, (index + 1))} handleDialogCancel={handleDialogCancel}></ConfrimDialog>}
                                        </Box>  
                                    </Grid>}
                                </>
                        })}

                    </Grid>
                </Box>
                {!props.onlyViewSplit && <Box component="div" mt={.5}>
                    <Grid container xs={12} justifyContent="flex-end">
                        <Button  href="#rowFocus" color="secondary" onClick={handleClose} size='small' sx={{ marginRight: '8px' }}>Cancel</Button>
                        <Button  href="#rowFocus" variant="contained" onClick={handleConfirm} size='small' color="primary">Confirm</Button>
                    </Grid>
                </Box>}
            </Box>
        </>
    )
}
export default SplitUnit;